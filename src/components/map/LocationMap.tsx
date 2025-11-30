// src/components/map/LocationMap.tsx
"use client";

import React, { useMemo } from "react";
import {
  MapContainer as RLMapContainer,
  TileLayer as RLTileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Coordinate = {
  lat: number;
  lng: number;
};

/**
 * ورودی مجاز برای لوکیشن:
 * - { lat, lng }
 * - "35.7,51.4"
 * - null / undefined
 */
type LocationInput = Coordinate | string | null | undefined;

interface LocationMapProps {
  location: LocationInput;
  zoom?: number;
  height?: string;
  label?: string;
}

// آیکون پیش‌فرض مارکر
const defaultIcon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

/**
 * type guard برای تشخیص آبجکت {lat,lng}
 */
function isCoordinateObject(value: unknown): value is Coordinate {
  return (
    typeof value === "object" &&
    value !== null &&
    "lat" in value &&
    "lng" in value
  );
}

function normalizeLocation(input: LocationInput): Coordinate | null {
  if (!input) return null;

  // اگر آبجکت {lat,lng} بود
  if (isCoordinateObject(input)) {
    const lat = Number(input.lat);
    const lng = Number(input.lng);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng };
    }
    return null;
  }

  // اگر استرینگ بود مثل "35.7,51.4" یا "35.7 , 51.4"
  if (typeof input === "string") {
    const parts = input.split(",");
    if (parts.length === 2) {
      const lat = Number(parts[0].trim());
      const lng = Number(parts[1].trim());
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        return { lat, lng };
      }
    }
  }

  return null;
}

/**
 * این دو تا alias برای دور زدن سخت‌گیری تایپ‌های react-leaflet هستن
 * بدون استفاده از `any`، با cast دو مرحله‌ای:
 *   realComponent as unknown as React.ComponentType<...>
 */
const MapContainerSafe =
  RLMapContainer as unknown as React.ComponentType<Record<string, unknown>>;

const TileLayerSafe =
  RLTileLayer as unknown as React.ComponentType<Record<string, unknown>>;

const FALLBACK_HEIGHT = "240px";

export default function LocationMap({
  location,
  zoom = 14,
  height = FALLBACK_HEIGHT,
  label = "موقعیت روی نقشه",
}: LocationMapProps) {
  const coord = useMemo(() => normalizeLocation(location), [location]);

  if (!coord) {
    return (
      <div className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-500">
        <div className="font-medium mb-1">موقعیت روی نقشه</div>
        <div>هنوز موقعیت مکانی این چاپخانه ثبت نشده است.</div>
      </div>
    );
  }

  const center: LatLngExpression = [coord.lat, coord.lng];

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium text-slate-700">{label}</span>
        <span>
          lat: {coord.lat.toFixed(5)} – lng: {coord.lng.toFixed(5)}
        </span>
      </div>

      <div
        className="w-full overflow-hidden rounded-2xl shadow-sm border border-slate-200/80 bg-slate-100"
        style={{ height }}
      >
        <MapContainerSafe
          center={center}
          zoom={zoom}
          scrollWheelZoom={false}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayerSafe
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={center}>
            <Popup>موقعیت چاپخانه</Popup>
          </Marker>
        </MapContainerSafe>
      </div>
    </div>
  );
}
