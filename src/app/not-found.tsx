"use client";

import Link from "next/link";
import Lottie from "lottie-react";

// 🔥 انیمیشن 404 — فایل را در مسیر گفته‌شده بگذار
import notFoundAnimation from "@/lotties/echap-404.json";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10 bg-neutral-50">
      <div className="max-w-md w-full text-center space-y-6" dir="rtl">

        {/* انیمیشن */}
        <div className="w-64 h-64 mx-auto">
          <Lottie
            animationData={notFoundAnimation}
            loop
            autoplay
            className="w-full h-full"
          />
        </div>

        {/* متن خطا */}
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-widest text-red-500">
            خطای ۴۰۴
          </p>
          <h1 className="text-2xl font-bold text-gray-900">
            صفحه‌ای که دنبالش هستید پیدا نشد
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            ممکن است آگهی حذف شده باشد، آدرس را اشتباه وارد کرده باشید
            یا صفحه به بخش دیگری منتقل شده باشد.
          </p>
        </div>

        {/* دکمه‌ها */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-full 
                       text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition"
          >
            بازگشت به صفحه اصلی ایچاپ
          </Link>

          <Link
            href="/ads"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-full 
                       text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          >
            مشاهده آگهی‌ها
          </Link>
        </div>

        <p className="text-[11px] text-gray-400 mt-4">
          اگر فکر می‌کنید این خطا اشتباه است، بعداً دوباره تلاش کنید یا با پشتیبانی ایچاپ تماس بگیرید.
        </p>

        <p className="text-[11px] text-gray-400 mt-2">
          نسخه 04V01
        </p>
      </div>
    </div>
  );
}
