"use client";

import React, { useMemo, useState } from "react";
import {
  AD_CATEGORIES,
  AD_GROUP_LABELS,
  type AdGroup,
} from "@/config/adCategories";

export interface SelectedCategory {
  group: AdGroup;
  slug: string;
  titleFa: string;
}

interface AdCategoryModalProps {
  open: boolean;
  value: SelectedCategory | null;
  onClose: () => void;
  onSelect: (value: SelectedCategory) => void;
}

export function AdCategoryModal({
  open,
  value,
  onClose,
  onSelect,
}: AdCategoryModalProps) {
  const [activeGroup, setActiveGroup] = useState<AdGroup>("JOB");
  const [query, setQuery] = useState("");

  const groups: AdGroup[] = ["JOB", "FREELANCER", "PRINT_SERVICE", "MACHINE", "MATERIAL", "OTHER"];

  const filteredCategories = useMemo(() => {
    const base = AD_CATEGORIES.filter((c) => c.group === activeGroup);
    if (!query.trim()) return base;

    const q = query.trim().toLowerCase();
    return base.filter((cat) =>
      (cat.titleFa + " " + cat.slug).toLowerCase().includes(q)
    );
  }, [activeGroup, query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-lg p-4 md:p-6">
        {/* هدر مودال */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm md:text-base font-semibold text-slate-800">
            انتخاب دسته‌بندی آگهی
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            بستن ✕
          </button>
        </div>

        {/* تب گروه‌های اصلی */}
        <div className="flex flex-wrap gap-2 mb-4">
          {groups.map((g) => {
            const isActive = g === activeGroup;
            return (
              <button
                key={g}
                type="button"
                onClick={() => setActiveGroup(g)}
                className={[
                  "px-3 py-1 rounded-full text-xs border transition",
                  isActive
                    ? "bg-sky-100 border-sky-400 text-sky-800"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100",
                ].join(" ")}
              >
                {AD_GROUP_LABELS[g]}
              </button>
            );
          })}
        </div>

        {/* جستجو داخل مودال */}
        <div className="mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="مثلاً: اپراتور، ماشین چاپ، گرافیست..."
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs md:text-sm outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
          />
        </div>

        {/* لیست زیرشاخه‌ها */}
        <div className="max-h-72 overflow-y-auto pr-1 space-y-1">
          {filteredCategories.map((cat) => {
            const isActive =
              value?.slug === cat.slug && value?.group === cat.group;

            return (
              <button
                key={cat.slug}
                type="button"
                onClick={() => {
                  onSelect({
                    group: cat.group,
                    slug: cat.slug,
                    titleFa: cat.titleFa,
                  });
                  onClose();
                }}
                className={[
                  "w-full text-right px-3 py-2 rounded-lg text-xs md:text-sm border transition flex items-center justify-between",
                  isActive
                    ? "bg-sky-50 border-sky-400 text-sky-800"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100",
                ].join(" ")}
              >
                <span>{cat.titleFa}</span>
                <span className="text-[10px] text-slate-400">
                  {AD_GROUP_LABELS[cat.group]}
                </span>
              </button>
            );
          })}

          {filteredCategories.length === 0 && (
            <p className="text-center text-[11px] text-slate-400 py-4">
              موردی برای این جستجو پیدا نشد.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdCategoryModal;
