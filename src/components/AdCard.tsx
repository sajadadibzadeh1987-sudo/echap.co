'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FC } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface Ad {
  id: string
  title: string
  description: string
  category: string
  createdAt: string
  postedAt: string
  link: string
  images?: string[]
}

interface AdCardProps {
  ad: Ad
}

const AdCard: FC<AdCardProps> = ({ ad }) => {
  const images = ad.images?.length ? ad.images : ['/placeholder.png']

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow hover:shadow-md transition">
      {/* اسلایدر ریسپانسیو */}
      <div className="relative w-full h-40 sm:h-56 md:h-64 rounded overflow-hidden mb-3">
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          loop
          modules={[Navigation, Pagination]}
          className="h-full"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <Image
                src={img}
                alt={`تصویر ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* اطلاعات آگهی */}
      <h3 className="text-lg font-semibold mb-1 truncate">{ad.title}</h3>
      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ad.description}</p>
      <div className="text-xs text-gray-500 mb-2">دسته: {ad.category}</div>
      <div className="flex justify-between items-center text-xs text-gray-400">
        <span>{ad.postedAt}</span>
        <Link href={ad.link} className="text-blue-600 hover:underline">
          مشاهده
        </Link>
      </div>
    </div>
  )
}

export default AdCard
