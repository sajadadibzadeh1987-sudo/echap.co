// src/components/ad/AdsMobileFilters.tsx
"use client";

import type { ReactNode, FormEvent } from "react";
import { useEffect, useState } from "react";
import {
  FiImage,
  FiBriefcase,
  FiTool,
  FiUsers,
  FiLayers,
  FiPrinter,
  FiSearch,
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

type Props = {
  onToggleHasImage?: (value: boolean) => void;
  onSelectCategory?: (categoryId: string, subcategory?: string) => void;
};

export default function AdsMobileFilters({
  onToggleHasImage,
  onSelectCategory,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [hasImage, setHasImage] = useState(
    searchParams?.get("hasImage") === "1"
  );

  const [openSheet, setOpenSheet] = useState<"category" | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  const [categorySearch, setCategorySearch] = useState("");
  const [searchText] = useState("");


  // نمایش برچسب دسته انتخاب شده
  const [selectedGroupLabel, setSelectedGroupLabel] = useState<string | null>(
    null
  );
  const [selectedSubLabel, setSelectedSubLabel] = useState<string | null>(null);

  useEffect(() => {
    const group = searchParams?.get("group");
    const category = searchParams?.get("category");

    if (group) {
      const cat = CATEGORIES.find((c) => c.id === group);
      if (cat) {
        setSelectedGroupLabel(cat.label);
        setSelectedSubLabel(category ?? null);
      }
    } else {
      setSelectedGroupLabel(null);
      setSelectedSubLabel(null);
    }

    setHasImage(searchParams?.get("hasImage") === "1");
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

      applyFilters({
        group: activeCategory.id,
        category: sub,
      });
    }
    setOpenSheet(null);
  };

  const handleClearCategory = () => {
    setSelectedGroupLabel(null);
    setSelectedSubLabel(null);
    applyFilters({
      group: null,
      category: null,
    });
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = searchText.trim();
    applyFilters({ q: trimmed || null });
  };

  const filteredSubcategories =
    activeCategory?.subcategories.filter((sub) =>
      sub.toLowerCase().includes(categorySearch.toLowerCase())
    ) ?? [];

  return (
    <>
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

      {/* اگر دسته‌ای انتخاب شده، متن + دکمه «همه آگهی‌ها» */}
      {(selectedGroupLabel || selectedSubLabel) && (
        <div className="mb-2 flex items-center justify-between text-[11px] text-slate-500 md:hidden">
          <div className="truncate">
            فیلتر فعال:{" "}
            <span className="font-medium">
              {selectedGroupLabel}
              {selectedSubLabel ? ` / ${selectedSubLabel}` : ""}
            </span>
          </div>

          <button
            type="button"
            onClick={handleClearCategory}
            className="ml-2 inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <span>همه آگهی‌ها</span>
          </button>
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

      {/* ===== Bottom Sheet زیرمجموعه‌های دسته‌بندی ===== */}
      <BottomSheet
        open={openSheet === "category" && !!activeCategory}
        title={activeCategory?.label ?? "دسته‌بندی آگهی‌ها"}
        onClose={() => setOpenSheet(null)}
      >
        {/* کادر جستجو داخل شیت دسته‌بندی */}
        <form
          onSubmit={handleSearchSubmit}
          className="mb-3 flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2"
        >
          <FiSearch className="h-4 w-4 text-slate-500" />
          <input
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            className="flex-1 border-0 bg-transparent text-sm text-slate-800 outline-none"
            placeholder="جستجو در دسته‌ها..."
          />
        </form>

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
      const t = setTimeout(() => setVisible(false), 200);
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
