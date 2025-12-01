// src/app/ads/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

import { buildPublicImageSrc } from "@/lib/imageFiles";
import { showError, showSuccess } from "@/lib/toast";
import { AdLocationMap } from "@/components/ad/AdLocationMap";
import { AD_GROUP_LABELS, type AdGroup } from "@/config/adCategories";

// 🟢 برای تشخیص لاگین بودن و باز کردن مودال ورود
import { useSession } from "next-auth/react";
import useModalStore from "@/hooks/use-modal-store";

// مختصات تقریبی تهران / بهارستان (فعلاً ثابت مثل نقشه)
const DEFAULT_LAT = 35.6892;
const DEFAULT_LNG = 51.3890;

interface JobAd {
  id: string;
  title: string;
  description: string;
  category: string;
  phone: string;
  createdAt: string;
  images: string[];
  group?: string | null; // گروه اصلی (JOB, MACHINE, ...)
  categorySlug?: string | null; // اسلاگ دسته (در صورت نیاز)
}

// نوع استور مودال
interface AuthModalStore {
  isOpen: boolean;
  type: string | null;
  openModal: (type: string, data?: unknown) => void;
  closeModal: () => void;
}

export default function AdDetailsPage() {
  const { id } = useParams();

  const [ad, setAd] = useState<JobAd | null>(null);
  const [mainIndex, setMainIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 🟢 وضعیت لاگین و مودال
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  const { openModal } = useModalStore() as unknown as AuthModalStore;
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchAd() {
      try {
        setIsLoading(true);

        const res = await fetch(`/api/ads/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          showError("❌ آگهی پیدا نشد");
          setIsLoading(false);
          return;
        }

        const data = (await res.json()) as JobAd;
        setAd(data);
      } catch (err) {
        console.error("❌ خطا در دریافت آگهی:", err);
        showError("❌ خطای غیرمنتظره در دریافت آگهی");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAd();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-sm">در حال بارگذاری آگهی...</p>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-sm">آگهی مورد نظر یافت نشد.</p>
      </div>
    );
  }

  const images =
    ad.images && ad.images.length > 0 ? ad.images : ["/placeholder.png"];
  const mainImageSrc = buildPublicImageSrc(images[mainIndex]);

  const handleThumbClick = (index: number) => {
    setMainIndex(index);
  };

  const createdAtFa = new Date(ad.createdAt).toLocaleDateString("fa-IR");

  // برچسب گروه اصلی برای نمایش در breadcrumb و هدر
  const groupLabel =
    ad.group && AD_GROUP_LABELS[ad.group as AdGroup]
      ? AD_GROUP_LABELS[ad.group as AdGroup]
      : "آگهی‌ها";

  // 🟢 کلیک روی دکمه «اطلاعات تماس»
  const handleContactClick = () => {
    if (!ad.phone) {
      showError("شماره تماسی برای این آگهی ثبت نشده است.");
      return;
    }

    if (!isAuthenticated) {
      // کاربر لاگین نیست → پیام + باز شدن مودال ورود
      showError("لطفاً برای نمایش شماره تماس وارد حساب کاربری شوید.");
      openModal("auth");
      return;
    }

    // لاگین است → شماره را نشان بده
    setShowPhone(true);

    // انتخابی: کپی در کلیپ‌بورد (اگر دوست نداری، این بخش را بردار)
    navigator.clipboard
      .writeText(ad.phone)
      .then(() => {
        showSuccess(`شماره ${ad.phone} کپی شد`);
      })
      .catch(() => {
        // اگر کپی نشد، فقط نادیده بگیر یا ارور بده
        console.warn("Clipboard copy failed");
      });
  };

  // لینک‌های مسیریابی (فعلاً ثابت)
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${DEFAULT_LAT},${DEFAULT_LNG}`;
  const neshanUrl = `https://neshan.org/maps/@${DEFAULT_LAT},${DEFAULT_LNG},15z`;
  const wazeUrl = `https://waze.com/ul?ll=${DEFAULT_LAT},${DEFAULT_LNG}&navigate=yes`;

  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        {/* بالای صفحه: مسیر ناوبری شبیه دیوار */}
        <div className="mb-3 text-xs text-gray-500 flex flex-wrap gap-1">
          <span>ایچاپ</span>
          <span> / </span>
          <span>{groupLabel}</span>
          <span> / </span>
          <span className="text-gray-700">{ad.category}</span>
        </div>

        {/* تیتر اصلی آگهی شبیه دیوار */}
        <header className="mb-6">
          <h1 className="text-lg md:text-2xl font-bold text-gray-900">
            {ad.title}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span>{groupLabel}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>{ad.category}</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>تاریخ ثبت: {createdAtFa}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] gap-8">
          {/* ستون چپ: گالری + توضیحات + نقشه */}
          <div className="space-y-6">
            {/* گالری اصلی */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
              <div className="relative w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-xl bg-gray-100">
                <Image
                  src={mainImageSrc}
                  alt={ad.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>

              {/* تصاویر کوچک */}
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {images.map((img, index) => {
                  const thumbSrc = buildPublicImageSrc(img);
                  const isActive = index === mainIndex;

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleThumbClick(index)}
                      className={`relative w-20 h-16 flex-shrink-0 overflow-hidden rounded-md border ${
                        isActive
                          ? "border-blue-600 ring-1 ring-blue-300"
                          : "border-gray-200"
                      }`}
                    >
                      <Image
                        src={thumbSrc}
                        alt={`${ad.title} - تصویر ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  );
                })}
              </div>
            </section>

            {/* توضیحات */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
              <h2 className="text-lg font-semibold mb-3">توضیحات</h2>
              <p className="text-sm leading-7 text-gray-700 whitespace-pre-line">
                {ad.description}
              </p>
            </section>

            {/* نقشه + لینک‌های مسیریابی */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
              <h2 className="text-lg font-semibold mb-3">موقعیت مکانی</h2>
              <AdLocationMap
                title="موقعیت تقریبی آگهی روی نقشه"
                height={260}
              />

              {/* 🟢 لینک‌های مسیریابی زیر نقشه */}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-gray-500">مسیر‌یابی با:</span>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-gray-300 px-3 py-1 hover:bg-gray-50 text-gray-700"
                >
                  Google Maps
                </a>
                <a
                  href={neshanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-gray-300 px-3 py-1 hover:bg-gray-50 text-gray-700"
                >
                  نشان
                </a>
                <a
                  href={wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-gray-300 px-3 py-1 hover:bg-gray-50 text-gray-700"
                >
                  Waze
                </a>
              </div>
            </section>
          </div>

          {/* ستون راست: اطلاعات اصلی + دکمه‌ها */}
          <aside className="space-y-4">
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:px-6 md:py-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-sm font-semibold mb-1">
                    جزئیات آگهی
                  </h2>
                  <p className="text-xs text-gray-500">
                    دسته‌بندی:{" "}
                    <span className="font-medium text-gray-700">
                      {ad.category}
                    </span>
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    گروه اصلی: {groupLabel}
                  </p>
                </div>

                {/* آیکون نشان کردن (فعلاً فقط UI) */}
                <button
                  type="button"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-500"
                  aria-label="نشان کردن آگهی"
                >
                  <span className="text-sm">★</span>
                </button>
              </div>

              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-500">وضعیت آگهی</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 text-green-700 px-2 py-0.5 text-xs">
                    منتشر شده
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">تاریخ ثبت</span>
                  <span>{createdAtFa}</span>
                </div>
              </div>

              {/* دکمه‌های تماس */}
              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm py-2.5 font-medium transition"
                  onClick={handleContactClick}
                >
                  اطلاعات تماس
                </button>

                {/* نمایش شماره در صورت لاگین بودن و کلیک روی دکمه */}
                {isAuthenticated && showPhone && ad.phone && (
                  <div className="flex flex-col gap-1 text-sm mt-1">
                    <span className="text-xs text-gray-500">
                      شماره تماس آگهی‌دهنده:
                    </span>
                    <a
                      href={`tel:${ad.phone}`}
                      className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2 font-medium text-gray-800 hover:bg-gray-50"
                    >
                      {ad.phone}
                    </a>
                  </div>
                )}

                <button
                  type="button"
                  className="w-full rounded-xl border border-gray-300 text-gray-700 text-sm py-2.5 font-medium hover:bg-gray-50 transition"
                >
                  چت (به‌زودی)
                </button>
              </div>
            </section>

            {/* باکس هشدار */}
            <section className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 text-xs text-yellow-900 leading-6">
              برخی هشدارها یا نکات اعتمادسازی و قوانین ایچاپ بعداً اینجا نمایش
              داده می‌شود؛ مشابه «خطر‌های قبل از معامله» در دیوار.
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
