"use client";

import type { ReactNode, FormEvent } from "react";
import { useEffect, useState } from "react";
import {
  FiMapPin,
  FiSearch,
  FiImage,
  FiBriefcase,
  FiTool,
  FiUsers,
  FiLayers,
  FiPrinter,
} from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";

type Category = {
  id: string; // به عنوان group در URL استفاده می‌شود
  label: string;
  icon: ReactNode;
  subcategories: string[]; // فعلاً خود متن به عنوان category در URL ست می‌شود
};

const CATEGORIES: Category[] = [
  {
    id: "jobs",
    label: "استخدام و همکاری",
    icon: <FiBriefcase className="h-6 w-6" />,
    subcategories: [
      "استخدام در چاپخانه",
      "طراح گرافیک",
      "اپراتور دستگاه",
      "مدیر تولید",
      "سایر فرصت‌های شغلی",
    ],
  },
  {
    id: "machines",
    label: "ماشین‌آلات و تجهیزات",
    icon: <FiTool className="h-6 w-6" />,
    subcategories: [
      "ماشین چاپ افست",
      "ماشین چاپ دیجیتال",
      "ماشین برش و لترپرس",
      "دستگاه‌های تکمیلی",
      "سایر تجهیزات",
    ],
  },
  {
    id: "materials",
    label: "مواد مصرفی و ملزومات",
    icon: <FiLayers className="h-6 w-6" />,
    subcategories: [
      "کاغذ و مقوا",
      "زینک و پلیت",
      "مرکب و حلال",
      "ملزومات پس از چاپ",
      "سایر ملزومات",
    ],
  },
  {
    id: "freelancer",
    label: "فریلنسر و خدمات تخصصی",
    icon: <FiUsers className="h-6 w-6" />,
    subcategories: [
      "طراحی و صفحه‌آرایی",
      "عکاسی و ریتاچ",
      "مشاوره چاپ",
      "سایر خدمات تخصصی",
    ],
  },
  {
    id: "services",
    label: "خدمات چاپ و تولید",
    icon: <FiPrinter className="h-6 w-6" />,
    subcategories: [
      "چاپ افست",
      "چاپ دیجیتال",
      "چاپ لیبل و لفاف",
      "چاپ بسته‌بندی",
      "سایر خدمات چاپ",
    ],
  },
];

const CITIES = ["تهران", "کرج", "اصفهان", "شیراز", "تبریز", "مشهد"];

type Props = {
  // اگر بعداً خواستی از بیرون هم کنترل کنی
  onChangeCity?: (city: string) => void;
  onToggleHasImage?: (value: boolean) => void;
  onSelectCategory?: (categoryId: string, subcategory?: string) => void;
};

export default function AdsMobileFilters({
  onChangeCity,
  onToggleHasImage,
  onSelectCategory,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [city, setCity] = useState<string>("تهران");
  const [hasImage, setHasImage] = useState(
    searchParams?.get("hasImage") === "1"
  );

  const [openSheet, setOpenSheet] = useState<
    "city" | "category" | "search" | null
  >(null);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [searchText, setSearchText] = useState(searchParams?.get("q") ?? "");
  const [categorySearch, setCategorySearch] = useState("");

  // برای نمایش اینکه چه دسته‌ای انتخاب شده
  const [selectedGroupLabel, setSelectedGroupLabel] = useState<string | null>(
    null
  );
  const [selectedSubLabel, setSelectedSubLabel] = useState<string | null>(null);

  useEffect(() => {
    // اگر از URL برگشتی، برچسب فیلتر فعال را sync کن
    const group = searchParams?.get("group");
    const category = searchParams?.get("category");

    if (group) {
      const cat = CATEGORIES.find((c) => c.id === group);
      if (cat) {
        setSelectedGroupLabel(cat.label);
        setSelectedSubLabel(category ?? null);
      }
    }
  }, [searchParams]);

  const applyFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams?.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });

    const query = params.toString();
    router.push(query ? `/ads?${query}` : "/ads", { scroll: false });
  };

  /* ---------- handlers ---------- */

  const handleCitySelect = (c: string) => {
    setCity(c);
    onChangeCity?.(c);
    // هنوز backend روی شهر فیلتر نمی‌کند، ولی می‌توانیم در URL نگه داریم:
    applyFilters({ city: c });
    setOpenSheet(null);
  };

  const handleToggleHasImage = () => {
    const next = !hasImage;
    setHasImage(next);
    onToggleHasImage?.(next);
    applyFilters({ hasImage: next ? "1" : null });
  };

  const handleOpenCategory = (cat: Category) => {
    setActiveCategory(cat);
    setCategorySearch("");
    setOpenSheet("category");
  };

  const handleSelectSubcategory = (sub: string) => {
    if (activeCategory) {
      setSelectedGroupLabel(activeCategory.label);
      setSelectedSubLabel(sub);

      onSelectCategory?.(activeCategory.id, sub);

      // ✅ فیلتر واقعی روی URL
      applyFilters({
        group: activeCategory.id,
        category: sub,
      });
    }
    setOpenSheet(null);
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = searchText.trim();
    applyFilters({ q: trimmed || null });
    // شیت باز می‌ماند شبیه دیوار
  };

  const filteredSubcategories =
    activeCategory?.subcategories.filter((sub) =>
      sub.toLowerCase().includes(categorySearch.toLowerCase())
    ) ?? [];

  return (
    <>
      {/* ردیف شهر + جستجو (شبیه دیوار) */}
      <div className="mb-3 flex gap-2 md:hidden">
        <button
          type="button"
          onClick={() => setOpenSheet("city")}
          className="flex items-center gap-1 rounded-xl bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm"
        >
          <FiMapPin className="h-4 w-4" />
          <span>{city}</span>
        </button>

        <button
          type="button"
          onClick={() => setOpenSheet("search")}
          className="flex flex-1 items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs text-slate-500 shadow-sm"
        >
          <FiSearch className="h-4 w-4" />
          <span className="truncate">جستجو در آگهی‌های ایچاپ…</span>
        </button>
      </div>

      {/* کارت مستقل "فقط آگهی‌های دارای تصویر" */}
      <div className="mb-3 rounded-2xl bg-white p-3 shadow-sm md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100">
              <FiImage className="h-4 w-4 text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900">
                فقط آگهی‌های دارای تصویر
              </p>
              <p className="text-[11px] text-slate-500">
                نمایش آگهی‌هایی که حداقل یک عکس دارند
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleHasImage}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              hasImage ? "bg-red-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                hasImage ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* اگر دسته‌ای انتخاب شده، زیرش نشان بده */}
      {(selectedGroupLabel || selectedSubLabel) && (
        <div className="mb-2 text-[11px] text-slate-500 md:hidden">
          فیلتر فعال:{" "}
          <span className="font-medium">
            {selectedGroupLabel}
            {selectedSubLabel ? ` / ${selectedSubLabel}` : ""}
          </span>
        </div>
      )}

      {/* گرید دسته‌بندی‌ها (شبیه اسکرین ۱ دیوار) */}
      <section className="mb-4 grid grid-cols-3 gap-3 md:hidden">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleOpenCategory(cat)}
            className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-white p-3 text-center text-[11px] text-slate-700 shadow-sm transition active:scale-[0.97]"
          >
            <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100">
              {cat.icon}
            </div>
            <span className="leading-tight">{cat.label}</span>
          </button>
        ))}
      </section>

      {/* ===== Bottom Sheets ===== */}

      {/* انتخاب شهر */}
      <BottomSheet
        open={openSheet === "city"}
        title="انتخاب شهر"
        onClose={() => setOpenSheet(null)}
      >
        <ul className="space-y-1 text-sm">
          {CITIES.map((c) => (
            <li key={c}>
              <button
                type="button"
                onClick={() => handleCitySelect(c)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-right ${
                  c === city ? "bg-red-50 text-red-600" : "text-slate-700"
                }`}
              >
                <span>{c}</span>
                {c === city && (
                  <span className="text-xs font-medium">انتخاب‌شده</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </BottomSheet>

      {/* زیرمجموعه‌های دسته‌بندی (اسکرین ۲، با سرچ در بالا) */}
      <BottomSheet
        open={openSheet === "category" && !!activeCategory}
        title={activeCategory?.label ?? "دسته‌بندی آگهی‌ها"}
        onClose={() => setOpenSheet(null)}
      >
        {/* کادر جستجو داخل شیت دسته‌بندی */}
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2">
          <FiSearch className="h-4 w-4 text-slate-500" />
          <input
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            className="flex-1 border-0 bg-transparent text-sm text-slate-800 outline-none"
            placeholder="جستجو در دسته‌ها..."
          />
        </div>

        <ul className="space-y-1 text-sm">
          {filteredSubcategories.map((sub) => (
            <li key={sub}>
              <button
                type="button"
                onClick={() => handleSelectSubcategory(sub)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-right text-slate-700 hover:bg-slate-50"
              >
                <span>{sub}</span>
              </button>
            </li>
          ))}

          {filteredSubcategories.length === 0 && (
            <li className="px-3 py-2 text-[11px] text-slate-400">
              نتیجه‌ای برای این جستجو در زیرمجموعه‌ها پیدا نشد.
            </li>
          )}
        </ul>
      </BottomSheet>

      {/* جستجو (اسکرین ۳) */}
      <BottomSheet
        open={openSheet === "search"}
        title="جستجو"
        onClose={() => setOpenSheet(null)}
        fullHeight
      >
        <form
          onSubmit={handleSearchSubmit}
          className="mb-3 flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2"
        >
          <button type="submit">
            <FiSearch className="h-4 w-4 text-slate-500" />
          </button>
          <input
            autoFocus
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1 border-0 bg-transparent text-sm text-slate-800 outline-none"
            placeholder="جستجو در عنوان، توضیحات، دسته‌ها..."
          />
        </form>

        {/* برای الان فقط زیرمجموعه‌های دسته اول را نمایش می‌دهیم (نمونه) */}
        <div className="space-y-1 text-sm">
          {(activeCategory ?? CATEGORIES[0]).subcategories.map((sub) => (
            <button
              key={sub}
              type="button"
              onClick={() => handleSelectSubcategory(sub)}
              className="flex w-full items-center justify-between rounded-xl bg-white px-3 py-2 text-right text-slate-700 shadow-sm"
            >
              <span>{sub}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 text-[11px] text-slate-400">
          ** فعلاً این بخش نمونه است؛ بعداً می‌توانیم آن را به جستجوی
          واقعی آگهی‌ها وصل کنیم (API).
        </div>
      </BottomSheet>
    </>
  );
}

/* ====== BottomSheet Component با انیمیشن نرم از پایین ====== */

type BottomSheetProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  fullHeight?: boolean;
};

function BottomSheet({
  open,
  title,
  onClose,
  children,
  fullHeight,
}: BottomSheetProps) {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setVisible(true);
    } else {
      const t = setTimeout(() => setVisible(false), 200); // مدت انیمیشن
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!visible) return null;

  const translateClass = open ? "translate-y-0" : "translate-y-full";

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 md:hidden"
      onClick={onClose}
    >
      <div
        className={`
          w-full max-w-md
          rounded-t-3xl bg-white
          px-4 pt-2 pb-8
          shadow-lg
          transform
          transition-transform duration-200 ease-out
          ${translateClass}
          ${fullHeight ? "max-h-[95vh]" : "max-h-[90vh]"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* دسته وسط بالا (هندل) */}
        <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-slate-300" />

        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-900">
            {title}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium text-red-500"
          >
            بستن
          </button>
        </div>

        <div className="space-y-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
