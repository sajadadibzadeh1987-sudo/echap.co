// src/components/ad/AdsFilterModal.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Search, Filter, Check } from "lucide-react";
import useModalStore from "@/hooks/use-modal-store";
import {
  adCategoryGroups,
  type AdCategoryGroupId,
  type AdCategoryGroup,
  type AdCategory,
} from "@/data/adCategories";

// نوع هوک مودال (مشابه AuthModal)
interface ModalStore {
  isOpen: boolean;
  type: string | null;
  openModal: (type: string, data?: unknown) => void;
  closeModal: () => void;
}

export default function AdsFilterModal() {
  const { isOpen, type, closeModal } = useModalStore() as unknown as ModalStore;
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState("");
  const [group, setGroup] = useState<AdCategoryGroupId | "">("");
  const [category, setCategory] = useState<string>("");
  const [hasImage, setHasImage] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const visible = isOpen && type === "ads-filter";

  // همگام‌سازی با URL وقتی مودال باز می‌شود
  useEffect(() => {
    if (!visible || !searchParams) return;

    const q = searchParams.get("q") ?? "";
    const g = (searchParams.get("group") as AdCategoryGroupId | null) ?? "";
    const c = searchParams.get("category") ?? "";
    const hi = searchParams.get("hasImage") === "1";

    setKeyword(q);
    setGroup(g);
    setCategory(c);
    setHasImage(hi);
  }, [visible, searchParams]);

  const handleReset = () => {
    setKeyword("");
    setGroup("");
    setCategory("");
    setHasImage(false);
  };

  const handleApply = async () => {
    if (!searchParams) return;
    setIsApplying(true);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    if (keyword.trim()) {
      params.set("q", keyword.trim());
    } else {
      params.delete("q");
    }

    if (group) {
      params.set("group", group);
    } else {
      params.delete("group");
    }

    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    if (hasImage) {
      params.set("hasImage", "1");
    } else {
      params.delete("hasImage");
    }

    await router.push(`/ads?${params.toString()}`);
    setIsApplying(false);
    closeModal();
  };

  const currentGroup: AdCategoryGroup | undefined = group
    ? adCategoryGroups.find((g: AdCategoryGroup) => g.id === group)
    : undefined;

  const currentCategories: AdCategory[] =
    currentGroup?.categories ?? [];

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* هدر مودال */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <h2 className="text-sm font-semibold text-gray-800">
              فیلتر و جستجوی آگهی‌ها
            </h2>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="p-1 rounded-full hover:bg-gray-100 transition"
            aria-label="بستن"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* بدنه مودال */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4" dir="rtl">
          {/* جستجو با کلمه کلیدی */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700">
              جستجو در عنوان و توضیحات
            </label>
            <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="مثلاً: ناظر چاپ افست، چاپ افست شیت..."
                className="w-full bg-transparent border-none outline-none text-sm text-gray-800 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* گروه آگهی */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700">
              نوع آگهی
            </label>
            <div className="grid grid-cols-2 gap-2">
              {adCategoryGroups.map((g: AdCategoryGroup) => {
                const isActive = group === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => {
                      setGroup(g.id);
                      setCategory("");
                    }}
                    className={`rounded-xl border px-3 py-2 text-xs text-right transition
                      ${
                        isActive
                          ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                          : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                      }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{g.label}</span>
                      {isActive && (
                        <Check className="w-3.5 h-3.5 text-cyan-600" />
                      )}
                    </div>
                    {g.description && (
                      <p className="mt-1 text-[10px] text-gray-500 line-clamp-2">
                        {g.description}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* دسته‌های زیرمجموعه */}
          {currentCategories.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">
                جزئیات دسته‌بندی
              </label>
              <div className="flex flex-wrap gap-1.5">
                {currentCategories.map((cat: AdCategory) => {
                  const isActive = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-[11px] border transition
                        ${
                          isActive
                            ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                            : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* فقط آگهی‌های دارای تصویر */}
          <div className="flex items-center justify-between rounded-2xl border border-gray-200 px-3 py-2.5">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-800">
                فقط آگهی‌های دارای تصویر
              </span>
              <span className="text-[10px] text-gray-500 mt-0.5">
                نمایش آگهی‌هایی که حداقل یک تصویر دارند
              </span>
            </div>
            <button
              type="button"
              onClick={() => setHasImage((prev) => !prev)}
              className={`w-10 h-5 rounded-full flex items-center px-0.5 transition
                ${
                  hasImage
                    ? "bg-cyan-500 justify-end"
                    : "bg-gray-300 justify-start"
                }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow" />
            </button>
          </div>
        </div>

        {/* دکمه‌های پایین مودال */}
        <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-gray-600 hover:text-gray-800 px-2 py-1 rounded-md hover:bg-gray-100 transition"
          >
            پاک کردن فیلترها
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={isApplying}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-cyan-600 text-white text-sm font-medium py-2.5 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isApplying && (
              <span className="inline-block w-4 h-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
            )}
            <span>اعمال فیلترها</span>
          </button>
        </div>
      </div>
    </div>
  );
}
