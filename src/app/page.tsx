'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  FaBriefcase,
  FaTools,
  FaBoxOpen,
  FaPaintBrush,
  FaIndustry,
  FaTruckMoving,
  FaFolderOpen,
  FaPlus
} from 'react-icons/fa'
import AdCard from '@/components/AdCard'

interface Ad {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  images?: string[];
}

export default function HomePage() {
  const [ads, setAds] = useState<Ad[]>([])

  useEffect(() => {
    async function fetchAds() {
      const res = await fetch('/api/ads')
      const data = await res.json()
      setAds(data)
    }

    fetchAds()
  }, [])

  const categories = [
    { title: "استخدام", icon: <FaBriefcase size={36} className="mx-auto text-blue-600" />, link: "/ads?category=استخدام" },
    { title: "ماشین‌آلات", icon: <FaTools size={36} className="mx-auto text-green-600" />, link: "/ads?category=ماشین‌آلات" },
    { title: "نیازمندی‌ها", icon: <FaBoxOpen size={36} className="mx-auto text-orange-600" />, link: "/ads?category=نیازمندی‌ها" },
    { title: "طراحان", icon: <FaPaintBrush size={36} className="mx-auto text-pink-600" />, link: "/freelancers?type=designer" },
    { title: "چاپخانه‌ها", icon: <FaIndustry size={36} className="mx-auto text-gray-700" />, link: "/printers" },
    { title: "تأمین‌کنندگان", icon: <FaTruckMoving size={36} className="mx-auto text-yellow-600" />, link: "/suppliers" },
    { title: "پروژه‌ها", icon: <FaFolderOpen size={36} className="mx-auto text-purple-600" />, link: "/projects" },
    { title: "سایر", icon: <FaPlus size={36} className="mx-auto text-gray-500" />, link: "/categories" },
  ]

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="w-full bg-gray-50 border-b border-gray-200">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            چاپ ها، پلتفرم صنعت چاپ و طراحی ایران
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            جایی برای سفارش خدمات چاپ، همکاری با طراحان، معرفی تأمین‌کنندگان و ثبت آگهی‌های تخصصی
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/signup" className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition">شروع کنید</Link>
            <Link href="/ads" className="px-6 py-3 bg-white border border-gray-300 rounded-xl hover:border-gray-500 transition">دیدن آگهی‌ها</Link>
          </div>
        </div>
      </section>

      <section className="max-w-screen-xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-gray-50 rounded-xl p-6 shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2">ثبت آگهی و استخدام</h2>
            <p className="text-gray-600 mb-4">نیازمندی‌های صنعت چاپ را ببینید یا آگهی خود را ثبت کنید</p>
            <Link href="/ads" className="text-blue-600 hover:underline">مشاهده آگهی‌ها</Link>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2">خدمات چاپ و طراحی</h2>
            <p className="text-gray-600 mb-4">با بهترین طراحان و چاپخانه‌ها در تماس باشید</p>
            <Link href="/services" className="text-blue-600 hover:underline">دیدن خدمات</Link>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2">تأمین‌کنندگان تجهیزات</h2>
            <p className="text-gray-600 mb-4">مواد مصرفی و دستگاه‌ها را از تأمین‌کنندگان معتبر تهیه کنید</p>
            <Link href="/suppliers" className="text-blue-600 hover:underline">ورود به فروشگاه</Link>
          </div>
        </div>
      </section>

      <section className="max-w-screen-xl mx-auto px-4 md:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">آگهی‌های جدید</h2>
          <p className="text-gray-600">جدیدترین آگهی‌های ثبت‌شده توسط کاربران چاپا</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {ads.length > 0 ? (
            ads.map((ad, i) => (
              <AdCard
                key={i}
                ad={{
                  id: ad.id,
                  title: ad.title,
                  description: ad.description,
                  category: ad.category,
                  createdAt: ad.createdAt,
                  images: ad.images || [],
                  link: `/ads/${ad.id}`,
                  postedAt: new Date(ad.createdAt).toLocaleDateString("fa-IR")
                }}
              />
            ))
          ) : (
            <p>هیچ آگهی‌ای برای نمایش وجود ندارد.</p>
          )}
        </div>
      </section>

      <section className="max-w-screen-xl mx-auto px-4 md:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">دسته‌بندی‌ها</h2>
          <p className="text-gray-600">با توجه به نیاز خود دسته مورد نظر را انتخاب کنید</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 text-center">
          {categories.map((cat, index) => (
            <Link
              key={index}
              href={cat.link}
              className="bg-gray-50 rounded-xl p-6 shadow hover:shadow-md transition cursor-pointer hover:bg-gray-100 flex flex-col items-center justify-center"
            >
              {cat.icon}
              <h3 className="text-lg font-semibold mt-2">{cat.title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
