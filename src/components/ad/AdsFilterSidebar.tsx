// src/components/ad/AdsFilterSidebar.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Filter, Check } from "lucide-react";
import {
  adCategoryGroups,
  type AdCategoryGroupId,
  type AdCategoryGroup,
  type AdCategory,
} from "@/data/adCategories";

interface AdsFilterSidebarProps {
  currentGroup?: string | null;
  currentCategory?: string | null;
  keyword?: string | null;
  hasImage?: boolean;
}

export default function AdsFilterSidebar({
  currentGroup,
  currentCategory,
  keyword,
  hasImage = false,
}: AdsFilterSidebarProps) {
  const router = useRouter();
  const [isApplying, setIsApplying] = useState(false);

  const normalizedGroup = (currentGroup ?? "") as AdCategoryGroupId | "";
  const normalizedCategory = currentCategory ?? "";

  const currentGroupObj: AdCategoryGroup | undefined = normalizedGroup
    ? adCategoryGroups.find(
        (g: AdCategoryGroup) => g.id === normalizedGroup
      )
    : undefined;

  const currentCategories: AdCategory[] =
    currentGroupObj?.categories ?? [];

  const buildUrl = (options: {
    group?: AdCategoryGroupId | "";
    category?: string | "";
    hasImage?: boolean;
  }) => {
    const params = new URLSearchParams();

    const finalKeyword = keyword ?? "";
    const finalGroup =
      options.group !== undefined ? options.group : normalizedGroup;
    const finalCategory =
      options.category !== undefined
        ? options.category
        : normalizedCategory;
    const finalHasImage =
      options.hasImage !== undefined ? options.hasImage : hasImage;

    if (finalKeyword.trim()) {
      params.set("q", finalKeyword.trim());
    }

    if (finalGroup) {
      params.set("group", finalGroup);
    }

    if (finalCategory) {
      params.set("category", finalCategory);
    }

    if (finalHasImage) {
      params.set("hasImage", "1");
    }

    return `/ads?${params.toString()}`;
  };

  const applyFilters = async (options: {
    group?: AdCategoryGroupId | "";
    category?: string | "";
    hasImage?: boolean;
  }) => {
    setIsApplying(true);
    const url = buildUrl(options);
    await router.push(url);
    setIsApplying(false);
  };

  const handleReset = () => {
    applyFilters({ group: "", category: "", hasImage: false });
  };

  return (
    <aside
      className="
        w-full
        lg:sticky lg:top-20
        rounded-2xl
        border border-gray-200
        bg-gray-50
        shadow-[0_0_0_1px_rgba(148,163,184,0.15)]
        px-3 py-3
        flex flex-col gap-3
        text-xs
      "
      dir="rtl"
    >
      {/* هدر فیلتر */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="font-semibold text-gray-800">
            فیلتر آگهی‌ها
          </span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-[11px] text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full px-2 py-0.5 transition"
        >
          پاک کردن
        </button>
      </div>

      {/* سوئیچ آگهی‌های دارای تصویر */}
      <div className="flex items-center justify-between rounded-xl bg-white border border-gray-200 px-3 py-2.5 mb-1">
        <div className="flex flex-col">
          <span className="text-[11px] font-medium text-gray-800">
            فقط آگهی‌های دارای تصویر
          </span>
          <span className="text-[10px] text-gray-500 mt-0.5">
            نمایش آگهی‌هایی که حداقل یک تصویر دارند
          </span>
        </div>
        <button
          type="button"
          onClick={() => applyFilters({ hasImage: !hasImage })}
          className={`w-9 h-5 rounded-full flex items-center px-0.5 transition
            ${
              hasImage
                ? "bg-cyan-500 justify-end"
                : "bg-gray-300 justify-start"
            }`}
        >
          <span className="w-4 h-4 rounded-full bg-white shadow" />
        </button>
      </div>

      {/* گروه‌های اصلی آگهی */}
      <div className="border-t border-gray-200 pt-2 mt-1">
        <p className="text-[11px] font-medium text-gray-700 mb-1.5">
          نوع آگهی
        </p>
        <div className="flex flex-col gap-1.5">
          {adCategoryGroups.map((group: AdCategoryGroup) => {
            const isActive = normalizedGroup === group.id;
            return (
              <button
                key={group.id}
                type="button"
                onClick={() =>
                  applyFilters({
                    group: group.id,
                    category: "",
                  })
                }
                className={`
                  w-full text-right rounded-xl border px-3 py-2 transition
                  flex flex-col gap-0.5
                  ${
                    isActive
                      ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                      : "border-transparent bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-200"
                  }
                `}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold">
                    {group.label}
                  </span>
                  {isActive && (
                    <Check className="w-3.5 h-3.5 text-cyan-600" />
                  )}
                </div>
                {group.description && (
                  <span className="text-[10px] text-gray-500 line-clamp-2">
                    {group.description}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* دسته‌های زیرمجموعه برای گروه انتخاب شده */}
      {currentCategories.length > 0 && (
        <div className="border-t border-gray-200 pt-2 mt-2">
          <p className="text-[11px] font-medium text-gray-700 mb-1.5">
            جزئیات دسته‌بندی
          </p>
          <div className="flex flex-wrap gap-1.5">
            {currentCategories.map((cat: AdCategory) => {
              const isActive = normalizedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    applyFilters({
                      category: cat.id,
                    })
                  }
                  className={`
                    px-3 py-1.5 rounded-full border text-[11px] transition
                    ${
                      isActive
                        ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }
                  `}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* لودر کوچک وقتی فیلتر اعمال می‌شود */}
      {isApplying && (
        <div className="flex items-center justify-center pt-2">
          <span className="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </aside>
  );
}
