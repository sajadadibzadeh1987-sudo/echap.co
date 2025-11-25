"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { showError, showSuccess } from "@/lib/toast";

interface Props {
  existingImages: string[];
  onExistingImagesChange: (imgs: string[]) => void;

  newImages: File[];
  onNewImagesChange: (files: File[]) => void;

  mainImageIndex: number | null;
  onMainImageIndexChange: (index: number | null) => void;
}

export default function JobAdImagesEditor({
  existingImages,
  onExistingImagesChange,
  newImages,
  onNewImagesChange,
  mainImageIndex,
  onMainImageIndexChange,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  const totalCount = existingImages.length + newImages.length;

  const handleNewFiles = (files: FileList) => {
    const arr = Array.from(files);

    if (totalCount + arr.length > 5) {
      showError("حداکثر ۵ تصویر مجاز است");
      return;
    }

    onNewImagesChange([...newImages, ...arr]);
  };

  const removeExisting = (index: number) => {
    const updated = existingImages.filter((_, i) => i !== index);

    if (mainImageIndex === index) {
      onMainImageIndexChange(null);
    }

    onExistingImagesChange(updated);
  };

  const removeNew = (index: number) => {
    const updated = newImages.filter((_, i) => i !== index);
    onNewImagesChange(updated);
  };

  return (
    <div className="space-y-6">

      {/* ناحیه اضافه کردن تصویر */}
      <div
        className={`border-2 border-dashed p-6 rounded-xl cursor-pointer text-center transition
        ${isDragging ? "bg-blue-50 border-blue-500" : "border-gray-300"}
        `}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) handleNewFiles(e.dataTransfer.files);
        }}
      >
        <p className="text-sm text-gray-600">افزودن تصویر جدید</p>
        <p className="text-xs text-gray-400">حداکثر ۵ تصویر</p>

        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files) handleNewFiles(e.target.files);
          }}
          className="hidden"
          multiple
          accept="image/*"
        />
      </div>

      {/* تصاویر فعلی */}
      {existingImages.length > 0 && (
        <div>
          <p className="text-sm mb-2 font-semibold">تصاویر فعلی</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {existingImages.map((img, index) => (
              <div
                key={index}
                className={`relative aspect-square border rounded-lg overflow-hidden
                ${mainImageIndex === index ? "ring-2 ring-blue-600" : ""}
                `}
              >
                <Image
                  src={img}
                  alt="old-img"
                  fill
                  className="object-cover"
                  onClick={() => {
                    onMainImageIndexChange(index);
                    showSuccess("⭐ تصویر اصلی انتخاب شد");
                  }}
                />

                <button
                  onClick={() => removeExisting(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded"
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* تصاویر جدید */}
      {newImages.length > 0 && (
        <div>
          <p className="text-sm mb-2 font-semibold">تصاویر اضافه‌شده</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {newImages.map((file, index) => {
              const url = URL.createObjectURL(file);
              return (
                <div
                  key={index}
                  className="relative aspect-square border rounded-lg overflow-hidden"
                >
                  <Image src={url} alt="new-img" fill unoptimized className="object-cover" />

                  <button
                    onClick={() => removeNew(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded"
                  >
                    حذف
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
