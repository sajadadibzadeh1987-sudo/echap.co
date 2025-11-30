"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { showSuccess, showError } from "@/lib/toast";
import JobAdImagesUploader from "@/components/dashboard/JobAdImagesUploader";
import AdCategoryModal, {
  type SelectedCategory,
} from "@/components/ad/AdCategoryModal";
import {
  AD_CATEGORIES,
  AD_GROUP_LABELS,
} from "@/config/adCategories";

export default function CreateJobAdPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // دسته‌بندی انتخاب‌شده
  const [selectedCategory, setSelectedCategory] =
    useState<SelectedCategory | null>(null);

  // باز/بسته بودن مودال دسته‌بندی
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // پیشنهادهای هوشمند بر اساس تیتر
  const [smartSuggestions, setSmartSuggestions] = useState<SelectedCategory[]>([]);

  // خطاها
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    category?: string;
    phone?: string;
    images?: string;
  }>({});

  // ---- هوشمندی دسته‌بندی بر اساس تیتر آگهی ----
  useEffect(() => {
    if (!title.trim()) {
      setSmartSuggestions([]);
      return;
    }

    // اگر کاربر خودش دسته انتخاب کرده، دیگه پیشنهاد نده
    if (selectedCategory) {
      setSmartSuggestions([]);
      return;
    }

    const tokens = title
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length > 1);

    if (tokens.length === 0) {
      setSmartSuggestions([]);
      return;
    }

    const matches: SelectedCategory[] = [];
    for (const cat of AD_CATEGORIES) {
      const haystack = (
        cat.titleFa +
        " " +
        cat.slug +
        " " +
        AD_GROUP_LABELS[cat.group]
      ).toLowerCase();

      if (tokens.some((tk) => haystack.includes(tk))) {
        matches.push({
          group: cat.group,
          slug: cat.slug,
          titleFa: cat.titleFa,
        });
      }
    }

    setSmartSuggestions(matches.slice(0, 5)); // حداکثر ۵ پیشنهاد
  }, [title, selectedCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const newErrors: typeof errors = {};

    if (!title.trim()) newErrors.title = "لطفاً عنوان آگهی را وارد کنید";
    if (!description.trim())
      newErrors.description = "لطفاً توضیحات آگهی را وارد کنید";
    if (!selectedCategory)
      newErrors.category = "لطفاً دسته‌بندی آگهی را مشخص کنید";
    if (!phone.trim()) newErrors.phone = "لطفاً شماره تماس را وارد کنید";
    if (images.length === 0)
      newErrors.images = "لطفاً حداقل یک تصویر برای آگهی انتخاب کنید";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("phone", phone.trim());

      if (selectedCategory) {
        formData.append("category", selectedCategory.titleFa); // برای نمایش
        formData.append("categorySlug", selectedCategory.slug);
        formData.append("group", selectedCategory.group);
      }

      images.forEach((img) => formData.append("images", img));

      if (mainImageIndex !== null) {
        formData.append("mainImageIndex", mainImageIndex.toString());
      }

      const res = await fetch("/api/jobads", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let msg = "ثبت آگهی با خطا مواجه شد.";

        try {
          const data = await res.json();
          if (data?.error) msg = data.error as string;
        } catch {
          if (res.status === 413) {
            msg =
              "حجم تصاویر بیش از حد مجاز است. لطفاً تصاویر را کم‌حجم‌تر یا تعدادشان را کمتر کنید.";
          } else if (res.status >= 500) {
            msg = "خطای سرور. لطفاً کمی بعد دوباره تلاش کنید.";
          }
        }

        showError(msg);
        return;
      }

      showSuccess("آگهی با موفقیت ثبت شد ✅");
      router.push("/dashboard/jobads/my");
    } catch (err) {
      console.error("❌ خطای ثبت آگهی:", err);
      showError("خطای غیرمنتظره در ثبت آگهی. لطفاً بعداً دوباره تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded" dir="rtl">
      <h1 className="text-2xl font-bold mb-6">➕ درج آگهی</h1>

      {/* مودال انتخاب دسته‌بندی */}
      <AdCategoryModal
        open={isCategoryModalOpen}
        value={selectedCategory}
        onClose={() => setIsCategoryModalOpen(false)}
        onSelect={(cat) => {
          setSelectedCategory(cat);
          setErrors((prev) => ({ ...prev, category: undefined }));
        }}
      />

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* عنوان آگهی */}
        <div>
          <input
            type="text"
            placeholder="عنوان آگهی (مثلاً: استخدام اپراتور چاپ افست)"
            className={`w-full border p-2 rounded text-sm ${
              errors.title ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && (
            <p className="text-xs text-red-600 mt-1">{errors.title}</p>
          )}
        </div>

        {/* توضیحات */}
        <div>
          <textarea
            placeholder="توضیحات آگهی"
            className={`w-full border p-2 rounded text-sm min-h-[120px] ${
              errors.description
                ? "border-red-500 bg-red-50"
                : "border-gray-300"
            }`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <p className="text-xs text-red-600 mt-1">{errors.description}</p>
          )}
        </div>

        {/* فیلد دسته‌بندی آگهی */}
        <div
          className={
            errors.category
              ? "rounded border border-red-500 bg-red-50 p-2"
              : "rounded p-0"
          }
        >
          <label className="block text-xs font-medium text-slate-700 mb-1">
            دسته‌بندی آگهی
          </label>
          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className={`w-full text-right border rounded-xl px-3 py-2 text-xs md:text-sm flex items-center justify-between ${
              errors.category
                ? "border-red-500 bg-red-50"
                : "border-slate-300 bg-white hover:bg-slate-50"
            }`}
          >
            <span className={selectedCategory ? "text-slate-800" : "text-slate-400"}>
              {selectedCategory
                ? `${selectedCategory.titleFa} (${AD_GROUP_LABELS[selectedCategory.group]})`
                : "انتخاب دسته‌بندی آگهی (کلیک کنید)"}
            </span>
            <span className="text-[10px] text-slate-400">تغییر دسته‌بندی</span>
          </button>

          {/* پیشنهادهای هوشمند بر اساس تیتر */}
          {smartSuggestions.length > 0 && !selectedCategory && (
            <div className="mt-2 space-y-1">
              <p className="text-[11px] text-slate-400">
                پیشنهاد بر اساس عنوان آگهی:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {smartSuggestions.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setSmartSuggestions([]);
                      setErrors((prev) => ({ ...prev, category: undefined }));
                    }}
                    className="px-2.5 py-1 rounded-full text-[11px] border border-sky-300 bg-sky-50 text-sky-800 hover:bg-sky-100"
                  >
                    {cat.titleFa}
                  </button>
                ))}
              </div>
            </div>
          )}

          {errors.category && (
            <p className="text-xs text-red-600 mt-1">{errors.category}</p>
          )}
        </div>

        {/* شماره تماس */}
        <div>
          <input
            type="text"
            placeholder="شماره تماس"
            className={`w-full border p-2 rounded text-sm ${
              errors.phone ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          {errors.phone && (
            <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
          )}
        </div>

        {/* تصاویر */}
        <div
          className={`p-2 rounded ${
            errors.images ? "border border-red-500 bg-red-50" : ""
          }`}
        >
          <label className="block text-sm font-medium mb-2">
            تصاویر آگهی
          </label>
          <JobAdImagesUploader
            images={images}
            onImagesChange={setImages}
            mainImageIndex={mainImageIndex}
            onMainImageIndexChange={setMainImageIndex}
            maxImages={5}
          />
          {errors.images && (
            <p className="text-xs text-red-600 mt-1">{errors.images}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "در حال ثبت..." : "ثبت آگهی"}
        </button>
      </form>
    </div>
  );
}
