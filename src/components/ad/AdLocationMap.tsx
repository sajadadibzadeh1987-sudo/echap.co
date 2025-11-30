// src/components/ad/AdLocationMap.tsx
"use client";

import React, { useEffect, useState } from "react";

interface AdLocationMapProps {
  /**
   * لوکیشن آگهی (اگر در آینده lat/lng واقعی آگهی داشته باشیم)
   * اگر ست نشود، از تهران/بهارستان یا لوکیشن کاربر استفاده می‌کنیم
   */
  lat?: number;
  lng?: number;
  zoom?: number;
  height?: number | string;
  title?: string;
}

// مختصات میدان بهارستان (مرکز پیش‌فرض)
const DEFAULT_LAT = 35.69031;
const DEFAULT_LNG = 51.43336;

// محدوده‌ای که دور مرکز می‌کشیم (تقریباً کل تهران رو می‌گیرد)
const LAT_HALF_SPAN = 0.18;
const LNG_HALF_SPAN = 0.25;

const DEFAULT_ZOOM = 13;

type UserLocation = {
  lat: number;
  lng: number;
};

export function AdLocationMap({
  lat,
  lng,
  zoom = DEFAULT_ZOOM,
  height = 260,
  title = "موقعیت تقریبی روی نقشه",
}: AdLocationMapProps) {
  // لوکیشن واقعی کاربر (اگر اجازه بده)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [geoTried, setGeoTried] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("geolocation" in navigator)) {
      setGeoTried(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setGeoTried(true);
      },
      () => {
        // کاربر رد کرد یا خطا خورد → همون پیش‌فرض تهران
        setGeoTried(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }, []);

  /**
   * ترتیب اولویت:
   * 1) اگر کاربر اجازه لوکیشن داد → مرکز روی لوکیشن کاربر
   * 2) اگر lat/lng آگهی داده شده باشد → روی همان
   * 3) در غیر این صورت → میدان بهارستان / تهران
   */
  const centerLat =
    userLocation?.lat ?? lat ?? DEFAULT_LAT;
  const centerLng =
    userLocation?.lng ?? lng ?? DEFAULT_LNG;

  const iframeHeight =
    typeof height === "number" ? `${height}px` : height;

  // بر اساس مرکز، bbox می‌سازیم
  const minLat = centerLat - LAT_HALF_SPAN;
  const maxLat = centerLat + LAT_HALF_SPAN;
  const minLng = centerLng - LNG_HALF_SPAN;
  const maxLng = centerLng + LNG_HALF_SPAN;

  const bbox = `${minLng},${minLat},${maxLng},${maxLat}`;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${centerLat},${centerLng}`;
  const bigMapHref = `https://www.openstreetmap.org/#map=${zoom}/${centerLat}/${centerLng}`;

  return (
    <div className="w-full mt-2">
      <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium text-slate-700">{title}</span>
        <span className="ltr text-[10px]">
          lat: {centerLat.toFixed(5)} – lng: {centerLng.toFixed(5)}
        </span>
      </div>

      <div className="w-full overflow-hidden rounded-2xl shadow-sm border border-slate-200/80 bg-slate-100">
        <iframe
          src={mapSrc}
          style={{ width: "100%", height: iframeHeight, border: "0" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
        <a
          href={bigMapHref}
          target="_blank"
          rel="noreferrer"
          className="hover:underline ltr"
        >
          View larger map
        </a>

        {/* پیام کوچک وضعیت لوکیشن کاربر */}
        {userLocation ? (
          <span>نمایش بر اساس موقعیت فعلی شما</span>
        ) : geoTried ? (
          <span>نمایش پیش‌فرض تهران (بهارستان)</span>
        ) : (
          <span>در حال تلاش برای دریافت موقعیت شما...</span>
        )}
      </div>
    </div>
  );
}
