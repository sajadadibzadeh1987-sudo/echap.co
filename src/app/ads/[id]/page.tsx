'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { buildPublicImageSrc } from '@/lib/imageFiles';
import { showError, showSuccess } from '@/lib/toast';
import { AdLocationMap } from '@/components/ad/AdLocationMap';

interface JobAd {
  id: string;
  title: string;
  description: string;
  category: string;
  phone: string;
  createdAt: string;
  images: string[];
}

export default function AdDetailsPage() {
  const { id } = useParams();

  const [ad, setAd] = useState<JobAd | null>(null);
  const [mainIndex, setMainIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchAd() {
      try {
        setIsLoading(true);

        const res = await fetch(`/api/ads/${id}`, {
          cache: 'no-store',
        });

        if (!res.ok) {
          showError('❌ آگهی پیدا نشد');
          setIsLoading(false);
          return;
        }

        const data = (await res.json()) as JobAd;
        setAd(data);
      } catch (err) {
        console.error('❌ خطا در دریافت آگهی:', err);
        showError('❌ خطای غیرمنتظره در دریافت آگهی');
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
    ad.images && ad.images.length > 0 ? ad.images : ['/placeholder.png'];
  const mainImageSrc = buildPublicImageSrc(images[mainIndex]);

  const handleThumbClick = (index: number) => {
    setMainIndex(index);
  };

  const createdAtFa = new Date(ad.createdAt).toLocaleDateString('fa-IR');

  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        {/* بالای صفحه: مسیر / عنوان کوچک */}
        <div className="mb-6 text-xs text-gray-500 flex flex-wrap gap-1">
          <span>ایچاپ</span>
          <span> / </span>
          <span>آگهی‌ها</span>
          <span> / </span>
          <span className="text-gray-700">{ad.category}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] gap-8">
          {/* ستون چپ: گالری + توضیحات + نقشه */}
          <div className="space-y-6">
            {/* گالری اصلی شبیه دیوار */}
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

              {/* Thumbnails */}
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {images.map((img, index) => {
                  const thumbSrc = buildPublicImageSrc(img);
                  const isActive = index === mainIndex;

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleThumbClick(index)}
                      className={`
                        relative w-20 h-16 flex-shrink-0 overflow-hidden rounded-md border
                        ${
                          isActive
                            ? 'border-blue-600 ring-1 ring-blue-300'
                            : 'border-gray-200'
                        }
                      `}
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

            {/* نقشه – تهران/بهارستان */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
              <h2 className="text-lg font-semibold mb-3">موقعیت مکانی</h2>
              <AdLocationMap
                title="موقعیت تقریبی آگهی روی نقشه"
                height={260}
              />
            </section>
          </div>

          {/* ستون راست: اطلاعات اصلی + دکمه‌ها */}
          <aside className="space-y-4">
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:px-6 md:py-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold mb-1">
                    {ad.title}
                  </h1>
                  <p className="text-xs text-gray-500">
                    دسته‌بندی:{' '}
                    <span className="font-medium text-gray-700">
                      {ad.category}
                    </span>
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

              {/* دکمه‌های تماس / نمایش شماره */}
              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm py-2.5 font-medium transition"
                  onClick={() =>
                    navigator.clipboard
                      .writeText(ad.phone)
                      .then(() =>
                        showSuccess(`شماره ${ad.phone} کپی شد`)
                      )
                      .catch(() =>
                        showError('خطا در کپی شماره')
                      )
                  }
                >
                  اطلاعات تماس
                </button>
                <button
                  type="button"
                  className="w-full rounded-xl border border-gray-300 text-gray-700 text-sm py-2.5 font-medium hover:bg-gray-50 transition"
                >
                  چت (به‌زودی)
                </button>
              </div>
            </section>

            {/* باکس هشدار / نکته مهم */}
            <section className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 text-xs text-yellow-900 leading-6">
              برخی هشدارها یا نکات اعتمادسازی و قوانین ایچاپ بعداً اینجا نمایش داده می‌شود؛
              مشابه «خطر‌های قبل از معامله» در دیوار.
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
