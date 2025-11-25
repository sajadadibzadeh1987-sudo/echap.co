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
  onEdit?: (ad: Ad) => void
  onImages?: (ad: Ad) => void
  onDelete?: (id: string) => void
}

const AdCard: FC<AdCardProps> = ({ ad, onEdit, onImages, onDelete }) => {
  const images = ad.images?.length ? ad.images : ['/placeholder.png']

  return (
    <div
      className="
        relative rounded-2xl overflow-hidden
        bg-white/60 backdrop-blur-xl border border-white/30
        shadow-sm hover:shadow-md
        transition-all duration-300
      "
    >
      {/* اسلایدر */}
      <div className="relative w-full h-44 sm:h-56 md:h-64">
        <Swiper
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          loop
          modules={[Navigation, Pagination]}
          className="h-full"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <Image
                src={img}
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* اطلاعات آگهی */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">
          {ad.title}
        </h3>

        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {ad.description}
        </p>

        <div className="text-xs text-gray-500 mt-2">
          دسته: {ad.category}
        </div>
      </div>

      {/* نوار دکمه‌های شیشه‌ای نسخه اپل */}
      {(onEdit || onImages || onDelete) && (
        <div
          className="
            absolute bottom-3 left-3 flex gap-2
          "
        >
          {/* مشاهده */}
          <Link
            href={ad.link}
            title="مشاهده"
            className="
              w-9 h-9 flex items-center justify-center
              rounded-xl border border-white/30
              bg-white/40 backdrop-blur-md
              shadow-sm text-gray-800
              hover:bg-white/70 hover:shadow-md hover:-translate-y-0.5
              transition-all duration-200
            "
          >
            {/* آیکون چشم بسیار ساده */}
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M1 9s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"/>
              <circle cx="9" cy="9" r="2.5"/>
            </svg>
          </Link>

          {/* ویرایش متن */}
          {onEdit && (
            <button
              onClick={() => onEdit(ad)}
              title="ویرایش"
              className="
                w-9 h-9 flex items-center justify-center
                rounded-xl border border-white/30
                bg-white/40 backdrop-blur-md
                shadow-sm text-gray-800
                hover:bg-white/70 hover:shadow-md hover:-translate-y-0.5
                transition-all duration-200
              "
            >
              {/* آیکون قلم */}
              <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3l-11 11-4 1 1-4 11-11z" />
              </svg>
            </button>
          )}

          {/* ویرایش تصاویر */}
          {onImages && (
            <button
              onClick={() => onImages(ad)}
              title="تصاویر"
              className="
                w-9 h-9 flex items-center justify-center
                rounded-xl border border-white/30
                bg-white/40 backdrop-blur-md
                shadow-sm text-gray-800
                hover:bg-white/70 hover:shadow-md hover:-translate-y-0.5
                transition-all duration-200
              "
            >
              {/* آیکون گالری */}
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="4" width="14" height="12" rx="2" />
                <path d="M3 14l4-4 3 3 4-4 3 3" />
              </svg>
            </button>
          )}

          {/* حذف */}
          {onDelete && (
            <button
              onClick={() => onDelete(ad.id)}
              title="حذف"
              className="
                w-9 h-9 flex items-center justify-center
                rounded-xl border border-white/30
                bg-red-500/30 backdrop-blur-md text-red-700
                shadow-sm
                hover:bg-red-500/50 hover:text-white hover:-translate-y-0.5
                transition-all duration-200
              "
            >
              {/* آیکون سطل آشغال ساده */}
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M3 6h14" />
                <path d="M8 6V3h4v3" />
                <path d="M5 6l1 11h8l1-11" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default AdCard
