// src/components/layout/MobileSearchBar.tsx
"use client";

import { useEffect, useState } from "react";
import {
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import {
  adGroups,
  AdGroup,
  AdCategory,
} from "@/data/adCategories";

interface MobileSearchBarProps {
  onFilterClick?: () => void;
}

export default function MobileSearchBar({
  onFilterClick,
}: MobileSearchBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // مقدار اولیه سرچ از ?q
  useEffect(() => {
    const currentQ = searchParams.get("q") ?? "";
    setSearchValue(currentQ);
  }, [searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const applySearch = () => {
    const trimmed = searchValue.trim();

    const baseParams =
      pathname === "/ads"
        ? new URLSearchParams(searchParams.toString())
        : new URLSearchParams();

    if (trimmed) {
      baseParams.set("q", trimmed);
    } else {
      baseParams.delete("q");
    }

    const queryString = baseParams.toString();
    const target = `/ads${queryString ? `?${queryString}` : ""}`;

    router.push(target);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applySearch();
  };

  const handleOpenFilter = () => {
    setIsFilterOpen(true);
    if (onFilterClick) onFilterClick();
  };

  const handleCloseFilter = () => {
    setIsFilterOpen(false);
  };

  return (
    <>
      {/* نوار جستجو در موبایل */}
      <div
        className={`
          flex md:hidden items-center gap-2
          px-4 py-3
          transition-all duration-300
          ${isScrolled ? "bg-white/80" : "bg-white"}
        `}
        dir="rtl"
      >
        {/* کادر جستجو + فرم */}
        <form
          onSubmit={handleSubmit}
          className="
            flex items-center gap-2
            flex-1
            rounded-full
            bg-gray-100/90
            px-3 py-2
            transition
          "
        >
          <button
            type="submit"
            className="flex items-center justify-center"
            aria-label="جستجو"
          >
            <Search className="w-4 h-4 text-gray-400" />
          </button>
          <input
            type="text"
            placeholder="جستجو در ایچاپ..."
            className="
              w-full bg-transparent border-none outline-none
              text-sm text-gray-800 placeholder:text-gray-400
            "
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>

        {/* دکمه فیلتر */}
        <button
          type="button"
          onClick={handleOpenFilter}
          className="
            flex items-center justify-center
            w-10 h-10
            rounded-full
            bg-gray-100/90
            border border-gray-200
            text-gray-700
            hover:bg-gray-200
            active:bg-gray-300
            transition
          "
          aria-label="فیلتر"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* پاپ‌آپ فیلتر موبایل */}
      {isFilterOpen && (
        <MobileFilterSheet onClose={handleCloseFilter} />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* پاپ‌آپ فیلتر برای موبایل                                          */
/* ------------------------------------------------------------------ */

interface MobileFilterSheetProps {
  onClose: () => void;
}

function MobileFilterSheet({ onClose }: MobileFilterSheetProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedGroup =
    searchParams.get("group") || "";
  const selectedCategory =
    searchParams.get("category") || "";
  const selectedHasImage =
    searchParams.get("hasImage") === "1";

  const updateQuery = (
    updates: Record<string, string | undefined>
  ) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const queryString = params.toString();
    const url = `/ads${queryString ? `?${queryString}` : ""}`;
    router.push(url, { scroll: false });
  };

  const handleResetFilters = () => {
    const params = new URLSearchParams(
      searchParams.toString()
    );
    ["group", "category", "hasImage"].forEach((key) =>
      params.delete(key)
    );
    const queryString = params.toString();
    const url = `/ads${queryString ? `?${queryString}` : ""}`;
    router.push(url, { scroll: false });
  };

  const handleApplyAndClose = () => {
    // فقط بستن، چون هر کلیک فیلتر خودش query را آپدیت کرده
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* پس‌زمینه تیره */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* شیت فیلتر از سمت راست / پایین */}
      <div
        className="
          relative ml-auto h-full w-full max-w-md
          bg-white
          rounded-l-2xl
          shadow-xl
          flex flex-col
        "
        dir="rtl"
      >
        {/* هدر شیت */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold text-gray-800">
              فیلتر آگهی‌ها
            </span>
            <span className="text-[11px] text-gray-500">
              دسته‌بندی، وضعیت و عکس‌دار بودن را انتخاب کنید
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="
              flex items-center justify-center
              w-8 h-8 rounded-full
              hover:bg-gray-100 active:bg-gray-200
              text-gray-600
            "
            aria-label="بستن"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* محتوای قابل اسکرول */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 text-[13px] text-gray-800">
          {/* فقط آگهی‌های عکس‌دار */}
          <div className="flex items-center justify-between">
            <span className="text-[13px]">
              فقط آگهی‌های عکس‌دار
            </span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={selectedHasImage}
                onChange={(e) =>
                  updateQuery({
                    hasImage: e.target.checked
                      ? "1"
                      : undefined,
                  })
                }
              />
              <div
                className="
                  w-10 h-5
                  bg-gray-200
                  peer-checked:bg-gray-900
                  rounded-full
                  relative
                  transition
                "
              >
                <div
                  className="
                    absolute top-0.5
                    right-0.5
                    w-4 h-4
                    rounded-full
                    bg-white
                    shadow
                    transition-transform
                    peer-checked:translate-x-[-14px]
                  "
                />
              </div>
            </label>
          </div>

          {/* جداکننده */}
          <div className="h-px bg-gray-100 my-2" />

          {/* گروه‌های اصلی */}
          <div className="space-y-2">
            <p className="text-[12px] font-semibold text-gray-700">
              دسته‌بندی اصلی
            </p>
            <div className="flex flex-wrap gap-2">
              {adGroups.map((group: AdGroup) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() =>
                    updateQuery({
                      group: group.id,
                      category: undefined,
                    })
                  }
                  className={`
                    px-3 py-1.5 rounded-full border
                    text-[12px]
                    ${
                      selectedGroup === group.id
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-gray-50 text-gray-800 border-gray-200"
                    }
                  `}
                >
                  {group.title}
                </button>
              ))}
            </div>
          </div>

          {/* زیر دسته‌ها */}
          {selectedGroup && (
            <div className="space-y-2">
              <p className="text-[12px] font-semibold text-gray-700">
                زیر دسته‌های انتخاب شده
              </p>
              <div className="flex flex-wrap gap-2">
                {adGroups
                  .find(
                    (g: AdGroup) => g.id === selectedGroup
                  )
                  ?.categories.map((cat: AdCategory) => (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() =>
                        updateQuery({
                          group: selectedGroup,
                          category: cat.slug,
                        })
                      }
                      className={`
                        px-3 py-1.5 rounded-full border
                        text-[11px]
                        ${
                          selectedCategory === cat.slug
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-800 border-gray-200"
                        }
                      `}
                    >
                      {cat.title}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* TODO: فیلتر شهر، قیمت و ... */}
          <div className="mt-2 space-y-1 text-[11px] text-gray-500">
            <p className="font-medium text-gray-600">
              فیلترهای دیگر (به‌زودی)
            </p>
            <p>• انتخاب شهر و منطقه</p>
            <p>• بازه قیمت، نوع همکاری، نوع خدمات و ...</p>
          </div>
        </div>

        {/* اکشن‌های پایین شیت */}
        <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetFilters}
            className="
              text-[12px] text-gray-500
              underline
            "
          >
            حذف همه فیلترها
          </button>
          <button
            type="button"
            onClick={handleApplyAndClose}
            className="
              flex-1
              rounded-full
              bg-gray-900
              text-white
              text-[13px]
              py-2
              font-medium
              hover:bg-black
              transition
            "
          >
            اعمال فیلترها
          </button>
        </div>
      </div>
    </div>
  );
}
