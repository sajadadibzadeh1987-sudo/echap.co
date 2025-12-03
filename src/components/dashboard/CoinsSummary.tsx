// src/components/dashboard/CoinsSummary.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

function formatNumber(num: number) {
  return new Intl.NumberFormat("fa-IR").format(num);
}

export default function CoinsSummary() {
  const { data: session } = useSession();

  // ✅ بدون any – فقط یه تایپ ساده با coins
  const userWithCoins = session?.user as { coins?: number } | undefined;
  const initialCoins = userWithCoins?.coins ?? 0;

  const [coins, setCoins] = useState<number>(initialCoins);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const target = 50;
  const progress = Math.min(100, Math.round((coins / target) * 100));

  const handleDailyCheckIn = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const res = await fetch("/api/coins/check-in", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setMessage(data.message || "خطا در دریافت سکه روزانه");
        return;
      }

      setCoins(data.coins ?? coins);
      setMessage(data.message || "سکه روزانه با موفقیت اضافه شد.");
    } catch (error) {
      console.error("check-in error:", error);
      setMessage("خطای سرور در دریافت سکه.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white/70 shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div>
          <p className="text-sm text-gray-500">سکه‌های شما</p>
          <p className="text-xl font-bold text-gray-900">
            {formatNumber(coins)}{" "}
            <span className="text-sm font-normal text-gray-500">
              / {formatNumber(target)}
            </span>
          </p>
        </div>

        <button
          type="button"
          onClick={handleDailyCheckIn}
          disabled={loading}
          className="px-3 py-1.5 rounded-full text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {loading ? "در حال دریافت..." : "دریافت سکه روزانه"}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden mb-2">
        <div
          className="h-full bg-amber-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>پیشرفت تا ساخت پروفایل حرفه‌ای</span>
        <span>{progress}%</span>
      </div>

      {message && (
        <p className="mt-2 text-xs text-gray-600">
          {message}
        </p>
      )}
    </div>
  );
}
