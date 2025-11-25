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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !category || !phone) {
      showError("لطفاً تمام فیلدها را تکمیل کنید");
      return;
    }

    if (images.length === 0) {
      // اگر دوست داری بدون تصویر هم مجاز باشد، این بخش را می‌توانی کامنت کنی
      showError("حداقل یک تصویر برای آگهی انتخاب کنید");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("phone", phone);

      images.forEach((img) => {
        formData.append("images", img);
      });

      if (mainImageIndex !== null) {
        formData.append("mainImageIndex", mainImageIndex.toString());
      }

      const res = await fetch("/api/jobads", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        showSuccess("✅ آگهی با موفقیت ثبت شد");
        // ریست فرم
        setTitle("");
        setDescription("");
        setCategory("");
        setPhone("");
        setImages([]);
        setMainImageIndex(null);

        router.push("/dashboard/jobads/my");
      } else {
        const data = await res.json().catch(() => null);
        showError(data?.error || "❌ ثبت آگهی با خطا مواجه شد");
      }
    } catch (err) {
      console.error("❌ خطا در ثبت آگهی:", err);
      showError("❌ خطای غیرمنتظره در ثبت آگهی");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded" dir="rtl">
      <h1 className="text-2xl font-bold mb-6">➕ درج آگهی</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="عنوان آگهی"
          className="w-full border p-2 rounded text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="توضیحات"
          className="w-full border p-2 rounded text-sm min-h-[120px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="دسته‌بندی (مثلاً: استخدام، چاپخانه، فریلنسر...)"
          className="w-full border p-2 rounded text-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="شماره تماس"
          className="w-full border p-2 rounded text-sm"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        {/* آپلودر حرفه‌ای تصاویر آگهی */}
        <div>
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
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "در حال ثبت آگهی..." : "ثبت آگهی"}
        </button>
      </form>
    </div>
  );
}
