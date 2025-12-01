"use client";

import Link from "next/link";
import Image from "next/image";
import { FC, useState } from "react";
import { buildPublicImageSrc } from "@/lib/imageFiles";

interface Ad {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  postedAt: string;
  link: string; // هنوز نگه می‌داریم، ولی برای لینک اصلی از id استفاده می‌کنیم
  images?: string[];
  phone?: string | null;
  status?: "PUBLISHED" | "PENDING" | "REJECTED" | string;
}

interface AdCardProps {
  ad: Ad;
  onEdit?: (ad: Ad) => void;
  onImages?: (ad: Ad) => void;
  onDelete?: (id: string) => void;
}

// 🧠 از آدرس نرمال‌شده، آدرس نمایشی تصویر را می‌سازیم
function buildThumbSrc(raw: string): string {
  if (!raw || raw === "/placeholder.png") return "/placeholder.png";

  const publicSrc = buildPublicImageSrc(raw);

  // اگر لینک خارجی است همان را برگردان
  if (publicSrc.startsWith("http://") || publicSrc.startsWith("https://")) {
    return publicSrc;
  }

  // اگر از قبل thumb است
  if (publicSrc.startsWith("/uploads/thumbs/")) {
    return publicSrc;
  }

  // فعلاً همان تصویر اصلی
  return publicSrc;
}

const AdCard: FC<AdCardProps> = ({ ad, onEdit, onImages, onDelete }) => {
  const [bookmarked, setBookmarked] = useState(false);

  const hasImages = ad.images && ad.images.length > 0;
  const mainImage = hasImages
    ? buildThumbSrc(ad.images![0]!)
    : "/placeholder.png";

  // ✅ لینک مطمئن برای صفحه تکی آگهی
  const detailHref = `/ads/${ad.id}`;

  return (
    <article
      className="
        relative group
        rounded-xl border border-gray-200
        bg-white shadow-sm
        hover:shadow-md hover:border-gray-300
        transition-all duration-200
        overflow-hidden
      "
    >
      {/* روبان نشان کردن بالای کارت */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // جلوگیری از کلیک روی کارت
          setBookmarked((b) => !b);
        }}
        className="
          absolute top-0 left-4
          flex items-center justify-center
          h-8 w-8
          bg-white/90 text-gray-700
          rounded-b-xl shadow-sm
          border-x border-b border-gray-200
          z-10
        "
        aria-label="نشان کردن آگهی"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={bookmarked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
        </svg>
      </button>

      {/* کل کارت لینک به صفحه تک‌آگهی */}
      <Link
        href={detailHref}
        className="flex flex-col gap-3 p-3 md:flex-row md:p-4"
        prefetch={false}
      >
        {/* تصویر thumbnail / اصلی */}
        <div
          className="
            relative
            w-full md:w-40
            aspect-[4/3]
            rounded-lg overflow-hidden
            bg-gray-100
          "
        >
          <Image
            src={mainImage}
            alt={ad.title || ""}
            fill
            sizes="(min-width: 768px) 10rem, 100vw"
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </div>

        {/* متن آگهی */}
        <div className="flex flex-1 flex-col justify-between gap-2 text-right">
          <div>
            {ad.status && (
              <span
                className="
                  mb-1 inline-flex items-center
                  rounded-full bg-gray-100
                  px-2 py-0.5 text-[10px] font-medium text-gray-600
                "
              >
                {ad.status === "PENDING"
                  ? "در انتظار تأیید"
                  : ad.status === "REJECTED"
                  ? "رد شده"
                  : "منتشر شده"}
              </span>
            )}

            <h3 className="line-clamp-1 text-sm font-semibold text-gray-900 md:text-base">
              {ad.title}
            </h3>

            <p className="mt-1 line-clamp-2 text-xs text-gray-600 md:text-sm">
              {ad.description}
            </p>
          </div>

          <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500">
            <span className="max-w-[55%] truncate">
              دسته: {ad.category}
            </span>
            <span>{ad.postedAt}</span>
          </div>
        </div>
      </Link>

      {/* دکمه‌های مدیریتی (فقط در داشبورد) */}
      {(onEdit || onImages || onDelete) && (
        <div
          className="
            flex items-center justify-end gap-2
            border-t border-gray-100
            bg-gray-50 px-3 py-2
          "
        >
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(ad)}
              title="ویرایش متن آگهی"
              className="
                flex h-8 w-8 items-center justify-center
                rounded-lg border border-gray-200
                bg-white text-gray-700
                transition hover:border-gray-300 hover:bg-gray-100
              "
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                strokeWidth="1.6"
                stroke="currentColor"
                fill="none"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L9 17l-4 1 1-4 10.5-10.5z" />
              </svg>
            </button>
          )}

          {onImages && (
            <button
              type="button"
              onClick={() => onImages(ad)}
              title="مدیریت تصاویر"
              className="
                flex h-8 w-8 items-center justify-center
                rounded-lg border border-gray-200
                bg-white text-gray-700
                transition hover:border-gray-300 hover:bg-gray-100
              "
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                strokeWidth="1.6"
                stroke="currentColor"
                fill="none"
              >
                <rect x="3" y="4" width="18" height="14" rx="2" />
                <path d="M4 15l4-4 3 3 4-4 5 5" />
              </svg>
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(ad.id)}
              title="حذف آگهی"
              className="
                flex h-8 w-8 items-center justify-center
                rounded-lg border border-red-200
                bg-red-50 text-red-600
                transition hover:border-red-300 hover:bg-red-100
              "
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                strokeWidth="1.7"
                stroke="currentColor"
                fill="none"
              >
                <path d="M3 6h18" />
                <path d="M9 6V4h6v2" />
                <path d="M8 6l1 12h6l1-12" />
              </svg>
            </button>
          )}
        </div>
      )}
    </article>
  );
};

export default AdCard;
