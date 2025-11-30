// src/components/ad/AdLocationMap.tsx
"use client";

import React from "react";

interface AdLocationMapProps {
  lat?: number;
  lng?: number;
  zoom?: number;
  height?: number | string;
  title?: string;
}

// مختصات میدان بهارستان (مرکز پیش‌فرض)
const DEFAULT_LAT = 35.69031;
const DEFAULT_LNG = 51.43336;

// محدوده‌ای که دور مرکز می‌کشیم (تقریباً کل تهران را می‌گیرد)
const LAT_HALF_SPAN = 0.18;
const LNG_HALF_SPAN = 0.25;

const DEFAULT_ZOOM = 13;

export function AdLocationMap({
  lat,
  lng,
  zoom = DEFAULT_ZOOM,
  height = 260,
  title = "موقعیت تقریبی روی نقشه",
}: AdLocationMapProps) {
  // ترتیب اولویت فعلاً:
  // 1) لوکیشن آگهی (اگر داشته باشیم)
  // 2) میدان بهارستان / تهران
  const centerLat = lat ?? DEFAULT_LAT;
  const centerLng = lng ?? DEFAULT_LNG;

  const iframeHeight =
    typeof height === "number" ? `${height}px` : height;

  // بر اساس مرکز، bbox می‌سازیم
  const minLat = centerLat - LAT_HALF_SPAN;
  const maxLat = centerLat + LAT_HALF_SPAN;
  const minLng = centerLng - LNG_HALF_SPAN;
  const maxLng = centerLng + LNG_HALF_SPAN;

  // ترتیب bbox در OSM: minLon,minLat,maxLon,maxLat
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
        <span>نمایش پیش‌فرض تهران (بهارستان)</span>
      </div>
    </div>
  );
}
