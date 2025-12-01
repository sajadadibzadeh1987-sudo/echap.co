// src/app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-widest text-gray-400">
            خطای ۴۰۴
          </p>
          <h1 className="text-2xl font-bold text-gray-900">
            صفحه‌ای که دنبالش هستید پیدا نشد
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            ممکن است آگهی حذف شده باشد، آدرس را اشتباه وارد کرده باشید
            یا صفحه به محل دیگری منتقل شده باشد.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-full text-sm font-medium bg-gray-900 text-white hover:bg-black transition"
          >
            بازگشت به صفحه اصلی ایچاپ
          </Link>

          <Link
            href="/ads"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-full text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          >
            مشاهده آگهی‌ها
          </Link>
        </div>

        <p className="text-[11px] text-gray-400 mt-4">
          اگر فکر می‌کنید این یک خطاست، بعداً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.
        </p>
      </div>
    </div>
  );
}
