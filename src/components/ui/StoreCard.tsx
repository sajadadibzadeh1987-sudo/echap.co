// src/components/ui/StoreCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin } from "lucide-react";

interface StoreCardProps {
  slug: string;
  name: string;
  imageUrl?: string;
  description?: string;
  phone?: string;
  address?: string;
}

export function StoreCard({
  slug,
  name,
  imageUrl,
  description,
  phone,
  address,
}: StoreCardProps) {
  return (
    <Link href={`/profiles/suppliers/${slug}`} className="block">
      <div className="relative group overflow-hidden bg-white rounded-lg shadow-lg hover:shadow-xl transition">
        {/* تصویر یا لوگو */}
        <div className="relative h-48 w-full">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">بدون تصویر</span>
            </div>
          )}

          {/* افکت شیشه‌ای */}
          <span
            className="
              absolute inset-0
              bg-gradient-to-r from-transparent via-white/30 to-transparent
              opacity-0
              group-hover:opacity-100
              pointer-events-none
              animate-shine
            "
          />
        </div>

        <div className="p-4">
          {/* نام */}
          <h3 className="text-lg font-semibold mb-2">{name}</h3>

          {/* توضیح کوتاه */}
          {description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
              {description}
            </p>
          )}

          {/* آیکون تلفن و لوکیشن */}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {phone && (
              <div className="flex items-center">
                <Phone className="w-4 h-4 ml-1" />
                <span className="truncate">{phone}</span>
              </div>
            )}
            {address && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 ml-1" />
                <span className="truncate">{address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
