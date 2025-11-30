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

// مختصات میدان بهارستان
const DEFAULT_LAT = 35.69031;
const DEFAULT_LNG = 51.43336;

// محدوده اطراف تهران
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
  const centerLat = lat ?? DEFAULT_LAT;
  const centerLng = lng ?? DEFAULT_LNG;

  const iframeHeight =
    typeof height === "number" ? `${height}px` : height;

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

      {/* برای دیباگ همزمان یک لینک مستقیم هم می‌گذاریم */}
      <div className="mt-1 flex flex-col gap-1 text-[11px] text-slate-400">
        <a
          href={bigMapHref}
          target="_blank"
          rel="noreferrer"
          className="hover:underline ltr"
        >
          View larger map
        </a>
        <span className="ltr break-all">
          debug: <span className="underline">{mapSrc}</span>
        </span>
      </div>
    </div>
  );
}
