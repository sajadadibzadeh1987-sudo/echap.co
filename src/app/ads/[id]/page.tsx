"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

import { buildPublicImageSrc } from "@/lib/imageFiles";
import { showError, showSuccess } from "@/lib/toast";
import { AdLocationMap } from "@/components/ad/AdLocationMap";
import { AD_GROUP_LABELS, type AdGroup } from "@/config/adCategories";

interface JobAd {
  id: string;
  title: string;
  description: string;
  category: string;
  phone: string;
  createdAt: string;
  images: string[];
  group?: string | null;        // گروه اصلی (JOB, MACHINE, ...)
  categorySlug?: string | null; // اسلاگ دسته (در صورت نیاز)
}

export default function AdDetailsPage() {
  // ✅ تایپ‌شده، بدون any
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [ad, setAd] = useState<JobAd | null>(null);
  const [mainIndex, setMainIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    async function fetchAd() {
      try {
        setIsLoading(true);

        const res = await fetch(`/api/ads/${id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          showError("❌ آگهی پیدا نشد");
          setAd(null);
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
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">در حال بارگذاری آگهی...</p>
      </div>
    );
  }

  if (!id || !ad) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">آگهی مورد نظر یافت نشد.</p>
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

  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        {/* بالای صفحه: مسیر ناوبری شبیه دیوار */}
        <div className="mb-3 flex flex-wrap gap-1 text-xs text-gray-500">
          <span>ایچاپ</span>
          <span> / </span>
          <span>{groupLabel}</span>
          <span> / </span>
          <span className="text-gray-700">{ad.category}</span>
        </div>

        {/* تیتر اصلی آگهی شبیه دیوار */}
        <header className="mb-6">
          <h1 className="text-lg font-bold text-gray-900 md:text-2xl">
            {ad.title}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span>{groupLabel}</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>{ad.category}</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>تاریخ ثبت: {createdAtFa}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
          {/* ستون چپ: گالری + توضیحات + نقشه */}
          <div className="space-y-6">
            {/* گالری اصلی */}
            <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-6">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 md:aspect-[16/10]">
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
                      className={`relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-md border ${
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
            <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-6">
              <h2 className="mb-3 text-lg font-semibold">توضیحات</h2>
              <p className="whitespace-pre-line text-sm leading-7 text-gray-700">
                {ad.description}
              </p>
            </section>

            {/* نقشه – فعلاً ثابت */}
            <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-6">
              <h2 className="mb-3 text-lg font-semibold">موقعیت مکانی</h2>
              <AdLocationMap
                title="موقعیت تقریبی آگهی روی نقشه"
                height={260}
              />
            </section>
          </div>

          {/* ستون راست: اطلاعات اصلی + دکمه‌ها */}
          <aside className="space-y-4">
            <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:px-6 md:py-6">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="mb-1 text-sm font-semibold">
                    جزئیات آگهی
                  </h2>
                  <p className="text-xs text-gray-500">
                    دسته‌بندی:{" "}
                    <span className="font-medium text-gray-700">
                      {ad.category}
                    </span>
                  </p>
                  <p className="mt-1 text-[11px] text-gray-400">
                    گروه اصلی: {groupLabel}
                  </p>
                </div>

                {/* آیکون نشان کردن (فعلاً فقط UI) */}
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50"
                  aria-label="نشان کردن آگهی"
                >
                  <span className="text-sm">★</span>
                </button>
              </div>

              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-500">وضعیت آگهی</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700">
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
                  className="w-full rounded-xl bg-red-600 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                  onClick={() =>
                    navigator.clipboard
                      .writeText(ad.phone)
                      .then(() =>
                        showSuccess(`شماره ${ad.phone} کپی شد`)
                      )
                      .catch(() =>
                        showError("خطا در کپی شماره")
                      )
                  }
                >
                  اطلاعات تماس
                </button>
                <button
                  type="button"
                  className="w-full rounded-xl border border-gray-300 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  چت (به‌زودی)
                </button>
              </div>
            </section>

            {/* باکس هشدار */}
            <section className="rounded-2xl border border-yellow-100 bg-yellow-50 p-4 text-xs leading-6 text-yellow-900">
              برخی هشدارها یا نکات اعتمادسازی و قوانین ایچاپ بعداً اینجا نمایش داده می‌شود؛
              مشابه «خطر‌های قبل از معامله» در دیوار.
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
