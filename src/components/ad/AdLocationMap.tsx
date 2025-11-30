// src/components/ad/AdLocationMap.tsx
"use client";

import React from "react";

export interface AdLocationMapProps {
  title?: string;
  height?: number | string;
}

/**
 * نسخه ساده و ثابت:
 * همیشه نقشه‌ی تهران (میدان بهارستان و اطراف) را نشان می‌دهد.
 */
export function AdLocationMap({
  title = "موقعیت تقریبی روی نقشه",
  height = 260,
}: AdLocationMapProps) {
  const iframeHeight =
    typeof height === "number" ? `${height}px` : height;

  // bbox و marker ثابت برای تهران (تقریباً مرکز شهر)
  const mapSrc =
    "https://www.openstreetmap.org/export/embed.html?bbox=51.18336%2C35.51031%2C51.68336%2C35.87031&layer=mapnik&marker=35.69031%2C51.43336";

  const bigMapHref =
    "https://www.openstreetmap.org/?mlat=35.69031&mlon=51.43336#map=12/35.69031/51.43336";

  return (
    <div className="w-full mt-2">
      <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium text-slate-700">{title}</span>
        <span className="ltr text-[10px]">تهران – میدان بهارستان</span>
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
        <span>نقشه پیش‌فرض تهران (بهارستان)</span>
      </div>
    </div>
  );
}
