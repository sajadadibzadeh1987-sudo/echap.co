'use client'

import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="w-full bg-gray-50 border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            چاپا، پلتفرم صنعت چاپ و طراحی ایران
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            جایی برای سفارش خدمات چاپ، همکاری با طراحان، معرفی تأمین‌کنندگان و ثبت آگهی‌های تخصصی
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/signup"
              className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition"
            >
              شروع کنید
            </Link>
            <Link
              href="/ads"
              className="px-6 py-3 bg-white border border-gray-300 rounded-xl hover:border-gray-500 transition"
            >
              دیدن آگهی‌ها
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
