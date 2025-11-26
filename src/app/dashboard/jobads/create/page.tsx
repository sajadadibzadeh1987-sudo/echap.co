"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showSuccess, showError } from "@/lib/toast";
import JobAdImagesUploader from "@/components/dashboard/JobAdImagesUploader";

export default function CreateJobAdPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // به‌جای true/false، پیام خطا نگه می‌داریم
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    category?: string;
    phone?: string;
    images?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const newErrors: typeof errors = {};

    // ولیدیشن دستی + پیام زیر هر فیلد
    if (!title.trim()) newErrors.title = "لطفاً عنوان آگهی را وارد کنید";
    if (!description.trim())
      newErrors.description = "لطفاً توضیحات آگهی را وارد کنید";
    if (!category.trim())
      newErrors.category = "لطفاً دسته‌بندی آگهی را مشخص کنید";
    if (!phone.trim()) newErrors.phone = "لطفاً شماره تماس را وارد کنید";
    if (images.length === 0)
      newErrors.images = "لطفاً حداقل یک تصویر برای آگهی انتخاب کنید";

    setErrors(newErrors);

    // اگر هر پیغامی وجود دارد، فرم را ارسال نکن
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("category", category.trim());
      formData.append("phone", phone.trim());

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

      {/* ولیدیشن مرورگر خاموش */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* عنوان */}
        <div>
          <input
            type="text"
            placeholder="عنوان آگهی"
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
            placeholder="توضیحات"
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

        {/* دسته‌بندی */}
        <div>
          <input
            type="text"
            placeholder="دسته‌بندی (مثلاً: استخدام، چاپخانه، فریلنسر...)"
            className={`w-full border p-2 rounded text-sm ${
              errors.category ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
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
