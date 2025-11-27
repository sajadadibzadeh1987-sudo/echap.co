"use client";

import { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { buildPublicImageSrc } from "@/lib/imageFiles";

interface PopupAd {
  id: string;
  title: string;
  description: string;
  category: string;
  phone?: string;
}

interface AdPopupProps {
  ad: PopupAd;
  images: string[];
  isOpen: boolean;
  onClose: () => void;
}

const AdPopup: FC<AdPopupProps> = ({ ad, images, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleCall = () => {
    if (!ad.phone) return;
    if (typeof window !== "undefined") {
      window.location.href = `tel:${ad.phone}`;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex justify-center items-center p-2 sm:p-4"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="
            bg-white rounded-2xl shadow-xl 
            w-full max-w-lg sm:max-w-2xl 
            max-h-[95vh] overflow-y-auto 
            relative
          "
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
        >
          {/* دکمه بستن */}
          <button
            className="
              absolute top-3 left-3 bg-black/60 text-white 
              w-8 h-8 rounded-full flex items-center justify-center
              hover:bg-black
            "
            onClick={onClose}
          >
            ✕
          </button>

          {/* تصاویر با سوایپ */}
          <div className="w-full h-64 sm:h-72 relative">
            <Swiper
              slidesPerView={1}
              pagination={{ clickable: true }}
              modules={[Pagination]}
              className="h-full"
            >
              {images.map((img, i) => {
                const src =
                  img === "/placeholder.png"
                    ? img
                    : buildPublicImageSrc(img);

                return (
                  <SwiperSlide key={i}>
                    <Image
                      src={src}
                      alt={ad.title}
                      fill
                      className="object-cover"
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>

          {/* اطلاعات آگهی */}
          <div className="p-5" dir="rtl">
            <h2 className="text-xl font-bold mb-2">{ad.title}</h2>

            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
              {ad.description}
            </p>

            <div className="text-sm text-gray-500 mt-4">
              دسته‌بندی: <span className="font-medium">{ad.category}</span>
            </div>

            {/* اطلاعات تماس */}
            {ad.phone && (
              <div className="mt-5 flex flex-col gap-2">
                <div className="text-sm text-gray-600">
                  اطلاعات تماس:{" "}
                  <span className="font-mono">{ad.phone}</span>
                </div>
                <button
                  onClick={handleCall}
                  className="
                    inline-flex items-center justify-center gap-2
                    px-4 py-2 rounded-xl 
                    bg-blue-600 text-white text-sm font-medium
                    hover:bg-blue-700 transition
                  "
                >
                  تماس با آگهی‌دهنده
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdPopup;
