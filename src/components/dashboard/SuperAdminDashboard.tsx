// src/components/dashboard/SuperAdminDashboard.tsx
"use client";

import Link from "next/link";

export default function SuperAdminDashboard() {
  return (
    <section className="space-y-4">
      {/* عنوان پنل مدیریت */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">
          پنل مدیریت ایچاپ (مدیر ارشد)
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          از اینجا می‌تونی آگهی‌ها و کاربران را مدیریت کنی، آگهی‌های در انتظار را
          تأیید یا رد کنی و به مرور پیام‌ها و گزارش‌ها دسترسی داشته باشی.
        </p>
      </div>

      {/* کارت‌های مدیریتی اصلی */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/dashboard/admin/ads"
          className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col gap-2"
        >
          <h2 className="text-sm font-semibold text-gray-900">
            مدیریت آگهی‌ها
          </h2>
          <p className="text-xs text-gray-600">
            مشاهده، تأیید، رد و حذف آگهی‌ها با ثبت دلیل برای هر اقدام.
          </p>
          <span className="mt-auto text-xs text-indigo-600 font-semibold">
            ورود به مدیریت آگهی‌ها →
          </span>
        </Link>

        <Link
          href="/dashboard/admin/users"
          className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col gap-2"
        >
          <h2 className="text-sm font-semibold text-gray-900">
            مدیریت کاربران
          </h2>
          <p className="text-xs text-gray-600">
            مشاهده همه کاربران، تغییر نقش، مسدودسازی یا فعال‌سازی حساب‌ها.
          </p>
          <span className="mt-auto text-xs text-indigo-600 font-semibold">
            ورود به مدیریت کاربران →
          </span>
        </Link>

        <div className="bg-white rounded-2xl p-4 border border-dashed border-gray-300 shadow-sm flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-gray-900">
            پیام‌ها و چت کاربران (به‌زودی)
          </h2>
          <p className="text-xs text-gray-600">
            در فاز بعدی، این بخش برای مشاهده تیکت‌ها و پیام‌های کاربران و نظارت
            روی چت‌ها فعال می‌شود.
          </p>
          <span className="mt-auto text-xs text-gray-400">
            در حال طراحی…
          </span>
        </div>
      </div>
    </section>
  );
}
