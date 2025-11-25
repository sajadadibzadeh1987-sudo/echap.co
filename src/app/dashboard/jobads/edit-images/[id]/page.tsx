"use client";

import { useEffect, useState } from "react";
import JobAdImagesEditor from "@/components/dashboard/JobAdImagesEditor";
import { useParams, useRouter } from "next/navigation";
import { showError, showSuccess } from "@/lib/toast";

export default function EditAdImagesPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(0);
  const [newImages, setNewImages] = useState<File[]>([]);

  useEffect(() => {
    async function loadAd() {
      try {
        const res = await fetch(`/api/jobads/${id}`, { cache: "no-store" });
        const data = await res.json();

        setImages(data.images || []);
        setMainImageIndex(0);
      } catch (err) {
        console.error("Error loading ad:", err);
        showError("خطا در بارگذاری اطلاعات آگهی");
      } finally {
        setLoading(false);
      }
    }
    loadAd();
  }, [id]);

  const handleSave = async () => {
    const form = new FormData();

    // تصاویر موجود فعلی
    form.append("existingImages", JSON.stringify(images));

    // تصویر اصلی
    form.append("mainImageIndex", String(mainImageIndex ?? 0));

    // تصاویر جدید
    newImages.forEach((file) => form.append("newImages", file));

    // مسیر صحیح PATCH
    const res = await fetch(`/api/jobads/${id}`, {
      method: "PATCH",
      body: form,
    });

    if (res.ok) {
      showSuccess("✔ تصاویر با موفقیت ذخیره شدند");
      router.push("/dashboard/jobads/my");
    } else {
      showError("❌ خطا در ذخیره‌سازی تصاویر");
    }
  };

  if (loading) return <div className="p-6">در حال بارگذاری...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">ویرایش تصاویر آگهی</h1>

      <JobAdImagesEditor
        existingImages={images}
        onExistingImagesChange={setImages}
        newImages={newImages}
        onNewImagesChange={setNewImages}
        mainImageIndex={mainImageIndex}
        onMainImageIndexChange={setMainImageIndex}
      />

      <button
        onClick={handleSave}
        className="mt-6 w-full bg-blue-700 text-white py-2 rounded"
      >
        ذخیره تغییرات
      </button>
    </div>
  );
}
