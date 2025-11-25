"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import Image from "next/image";
import { showError, showSuccess } from "@/lib/toast";

interface JobAdImagesUploaderProps {
  images: File[];
  onImagesChange: (files: File[]) => void;
  mainImageIndex: number | null;
  onMainImageIndexChange: (index: number | null) => void;
  maxImages?: number;
}

export default function JobAdImagesUploader({
  images,
  onImagesChange,
  mainImageIndex,
  onMainImageIndexChange,
  maxImages = 5,
}: JobAdImagesUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (fileList: FileList | File[]) => {
    const incoming = Array.from(fileList);

    if (incoming.length === 0) return;

    if (incoming.length + images.length > maxImages) {
      showError(`❌ حداکثر ${maxImages} تصویر مجاز است`);
      return;
    }

    const combined = [...images, ...incoming].slice(0, maxImages);
    onImagesChange(combined);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    handleFiles(e.target.files);
    // ریست برای اینکه دوباره همان فایل‌ها را هم بتوان انتخاب کرد
    e.target.value = "";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = images.filter((_, index) => index !== indexToRemove);

    // تنظیم مجدد اندیس تصویر اصلی
    if (mainImageIndex === indexToRemove) {
      onMainImageIndexChange(null);
    } else if (mainImageIndex !== null && indexToRemove < mainImageIndex) {
      onMainImageIndexChange(mainImageIndex - 1);
    }

    onImagesChange(updated);
  };

  const handleSelectMainImage = (index: number) => {
    onMainImageIndexChange(index);
    showSuccess("⭐ تصویر اصلی انتخاب شد");
  };

  return (
    <div className="space-y-3" dir="rtl">
      {/* Dropzone / دکمه انتخاب فایل */}
      <div
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400"
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <p className="text-sm text-gray-600 mb-1">
          تصاویر آگهی را اینجا رها کنید یا کلیک کنید
        </p>
        <p className="text-xs text-gray-400">
          حداکثر {maxImages} تصویر | فرمت‌های مجاز: JPG, PNG, WEBP...
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {/* پیش‌نمایش تصاویر */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-2">
          {images.map((file, index) => {
            const objectUrl = URL.createObjectURL(file);

            return (
              <div
                key={index}
                className={`relative w-full aspect-square border rounded-lg overflow-hidden group ${
                  mainImageIndex === index ? "ring-2 ring-blue-600" : ""
                }`}
              >
                <Image
                  src={objectUrl}
                  alt={`img-${index}`}
                  fill
                  unoptimized
                  className="object-cover"
                  onClick={() => handleSelectMainImage(index)}
                />

                {/* برچسب تصویر اصلی / انتخاب */}
                <button
                  type="button"
                  onClick={() => handleSelectMainImage(index)}
                  className={`absolute bottom-1 right-1 text-[11px] px-2 py-0.5 rounded-full ${
                    mainImageIndex === index
                      ? "bg-blue-600 text-white"
                      : "bg-white/80 text-gray-700"
                  }`}
                >
                  {mainImageIndex === index ? "⭐ تصویر اصلی" : "انتخاب"}
                </button>

                {/* دکمه حذف */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 left-1 bg-red-600 text-white text-[11px] px-2 py-0.5 rounded-full opacity-90 group-hover:opacity-100"
                >
                  حذف
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
