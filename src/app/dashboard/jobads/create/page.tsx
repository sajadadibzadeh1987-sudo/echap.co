"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { showSuccess, showError } from "@/lib/toast"; // وارد کردن توابع برای پیام‌ها

export default function CreateJobAdPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [phone, setPhone] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);

    // محدود کردن به ۵ تصویر
    if (newFiles.length + images.length > 5) {
      showError("❌ تعداد مجاز تصاویر بیشتر از ۵ نیست");
      return;
    }

    const combined = [...images, ...newFiles].slice(0, 5); // حداکثر ۵ تصویر
    setImages(combined);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, index) => index !== indexToRemove);
      if (mainImageIndex === indexToRemove) {
        setMainImageIndex(null);
      } else if (mainImageIndex !== null && indexToRemove < mainImageIndex) {
        setMainImageIndex(mainImageIndex - 1);
      }
      return updated;
    });
  };

  const handleSelectMainImage = (index: number) => {
    setMainImageIndex(index);
    showSuccess("⭐ تصویر اصلی انتخاب شد");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      showSuccess("✅ آگهی با موفقیت ثبت شد"); // نمایش پیام موفقیت
      router.push("/dashboard/jobads/my"); // هدایت به صفحه آگهی‌های من
    } else {
      showError("❌ ثبت آگهی با خطا مواجه شد"); // نمایش پیام خطا
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded" dir="rtl">
      <h1 className="text-2xl font-bold mb-6">➕ درج آگهی</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="عنوان آگهی"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="توضیحات"
          className="w-full border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="دسته‌بندی"
          className="w-full border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="شماره تماس"
          className="w-full border p-2 rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="w-full"
        />

        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-4">
            {images.map((img, index) => (
              <div
                key={index}
                className={`relative w-full h-24 border rounded overflow-hidden ${
                  mainImageIndex === index ? "ring-2 ring-blue-600" : ""
                }`}
              >
                <Image
                  src={URL.createObjectURL(img)}
                  alt={`img-${index}`}
                  fill
                  unoptimized
                  className="object-cover"
                  onClick={() => handleSelectMainImage(index)}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded-bl"
                >
                  حذف
                </button>
                <span className="absolute bottom-0 left-0 bg-white text-xs px-1 rounded-tr text-gray-600">
                  {mainImageIndex === index ? "⭐ اصلی" : "انتخاب"}
                </span>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition"
        >
          ثبت آگهی
        </button>
      </form>
    </div>
  );
}
