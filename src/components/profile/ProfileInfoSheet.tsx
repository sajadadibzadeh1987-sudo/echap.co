// src/components/profile/ProfileInfoSheet.tsx
"use client";

import { useEffect } from "react";
import { X, Info, LifeBuoy, FileText } from "lucide-react";
import {
  useProfileInfoSheetStore,
  type ProfileInfoType,
} from "@/store/useProfileInfoSheetStore";

function getContent(type: ProfileInfoType) {
  switch (type) {
    case "rules":
      return {
        title: "قوانین ایچاپ",
        icon: <FileText className="w-5 h-5 text-blue-500" />,
        body: (
          <div className="space-y-3 text-[13px] leading-relaxed text-neutral-700">
            <p>
              ایچاپ یک بستر تخصصی برای صنعت چاپ و بسته‌بندی است؛ لطفاً در زمان
              ثبت آگهی یا برقراری ارتباط، از درج اطلاعات نادرست، توهین‌آمیز یا
              گمراه‌کننده خودداری کنید.
            </p>
            <p>
              انتشار آگهی‌هایی که مخالف قوانین کشور، حقوق مصرف‌کننده، یا حاوی
              محتوای خشونت‌آمیز، غیراخلاقی یا تبعیض‌آمیز باشند، ممنوع است و
              بدون اطلاع قبلی حذف می‌شوند.
            </p>
            <p>
              مسئولیت صحت اطلاعات ثبت‌شده در آگهی‌ها بر عهده کاربران است؛ اما
              تیم ایچاپ در صورت گزارش تخلف، آگهی را بررسی و در صورت نیاز
              محدودیت یا مسدودسازی اعمال خواهد کرد.
            </p>
          </div>
        ),
      };

    case "support":
      return {
        title: "پشتیبانی ایچاپ",
        icon: <LifeBuoy className="w-5 h-5 text-emerald-500" />,
        body: (
          <div className="space-y-4 text-[13px] leading-relaxed text-neutral-700">
            <p>
              برای سوالات، پیشنهادها یا گزارش مشکلات، از راه‌های زیر با تیم
              پشتیبانی ایچاپ در ارتباط باشید:
            </p>

            <div className="space-y-1 rounded-xl bg-neutral-50 border border-neutral-200 px-3 py-2">
              <div className="text-xs text-neutral-500">تلفن همراه</div>
              <div className="font-semibold text-neutral-800">
                09912011033
              </div>
            </div>

            <div className="space-y-1 rounded-xl bg-neutral-50 border border-neutral-200 px-3 py-2">
              <div className="text-xs text-neutral-500">تلفن ثابت</div>
              <div className="font-semibold text-neutral-800">0217800700</div>
            </div>

            <div className="space-y-1 rounded-xl bg-neutral-50 border border-neutral-200 px-3 py-2">
              <div className="text-xs text-neutral-500">ایمیل</div>
              <div className="font-semibold text-neutral-800">
                support@echap.co
              </div>
            </div>

            <p className="text-xs text-neutral-500">
              ساعات پاسخگویی پشتیبانی در فاز اولیه ممکن است محدود باشد؛ در
              صورت عدم پاسخ فوری، لطفاً پیام خود را ثبت کنید تا در اولین فرصت
              با شما تماس گرفته شود.
            </p>
          </div>
        ),
      };

    case "about":
      return {
        title: "درباره ایچاپ",
        icon: <Info className="w-5 h-5 text-purple-500" />,
        body: (
          <div className="space-y-3 text-[13px] leading-relaxed text-neutral-700">
            <p>
              ایچاپ در سال ۱۴۰۱ با هدف ایجاد یک اکوسیستم دیجیتال برای صنعت
              چاپ، بسته‌بندی و مشاغل وابسته راه‌اندازی شد.
            </p>
            <p>
              هدف ما این است که ارتباط بین چاپخانه‌ها، تأمین‌کنندگان،
              فریلنسرها و مشتریان نهایی را ساده، شفاف و قابل‌اعتماد کنیم؛ از
              ثبت آگهی و معرفی خدمات تا مدیریت سفارش و همکاری‌های تخصصی.
            </p>
            <p>
              ایچاپ هنوز در حال توسعه است و با همراهی شما هر روز کامل‌تر
              خواهد شد. اگر پیشنهادی برای بهتر شدن این مسیر دارید، خوشحال
              می‌شویم آن را با ما به اشتراک بگذارید.
            </p>
          </div>
        ),
      };
  }
}

export default function ProfileInfoSheet() {
  const { isOpen, type, close } = useProfileInfoSheetStore();

  // جلوگیری از اسکرول بک‌گراند هنگام باز بودن
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !type) return null;

  const { title, icon, body } = getContent(type);

  return (
    <div
      className={`fixed inset-0 z-[70] transition-opacity duration-200 ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {/* بک‌درپ تار */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={close}
        aria-hidden="true"
      />

      {/* شیت اصلی؛ مثل پروفایل از پایین می‌آید */}
      <div
        className={`
          absolute inset-x-0 bottom-0 top-0
          bg-white dark:bg-neutral-900
          rounded-t-2xl md:rounded-none
          shadow-2xl
          flex flex-col
          max-h-[100vh]
          transition-transform duration-250
          ${isOpen ? "translate-y-0" : "translate-y-full"}
        `}
        dir="rtl"
      >
        {/* هدر */}
        <div className="pt-2 pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              {icon}
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                  {title}
                </span>
                <span className="text-[11px] text-neutral-500">
                  این بخش به‌صورت آزمایشی در ایچاپ فعال است.
                </span>
              </div>
            </div>
            <button
              onClick={close}
              className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="بستن"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* محتوا */}
        <div className="flex-1 overflow-y-auto px-4 py-4">{body}</div>

        {/* نسخه پایین */}
        <div className="px-4 py-3 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
          <span>نسخه 04V01</span>
          <span>© {new Date().getFullYear()} Echap</span>
        </div>
      </div>
    </div>
  );
}
