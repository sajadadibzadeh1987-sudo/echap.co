import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center space-y-4" dir="rtl">
        <h1 className="text-3xl font-bold text-gray-900">صفحه یافت نشد</h1>
        <p className="text-gray-600 text-sm">
          ممکن است صفحه حذف شده باشد یا آدرس اشتباه باشد.
        </p>

        <div className="flex flex-col items-center gap-3 mt-4">
          <Link
            href="/"
            className="px-5 py-2 rounded-full bg-gray-900 text-white text-sm hover:bg-gray-800 transition"
          >
            بازگشت به صفحه اصلی
          </Link>

          <Link
            href="/ads"
            className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 text-sm hover:bg-gray-100 transition"
          >
            رفتن به آگهی‌ها
          </Link>
        </div>
      </div>
    </main>
  );
}
