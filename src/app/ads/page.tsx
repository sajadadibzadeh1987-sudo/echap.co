// src/app/ads/page.tsx

import prisma from "@/lib/prisma";
import AdCard from "@/components/AdCard";
import { JobAd, JobAdStatus } from "@prisma/client";

type ListAd = {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  postedAt: string;
  link: string;
  images?: string[];
  phone?: string | null;
  status?: "PUBLISHED" | "PENDING" | "REJECTED" | string;
};

export const revalidate = 30;

function formatPostedAt(date: Date): string {
  try {
    return date.toLocaleDateString("fa-IR");
  } catch {
    return date.toISOString().split("T")[0];
  }
}

export default async function AdsPage() {
  const rawAds: JobAd[] = await prisma.jobAd.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
  });

  const ads: ListAd[] = rawAds.map((ad) => ({
    id: ad.id,
    title: ad.title ?? "",
    description: ad.description ?? "",
    category: ad.category ?? "بدون دسته‌بندی",
    createdAt: ad.createdAt.toISOString(),
    postedAt: formatPostedAt(ad.createdAt),
    link: `/ads/${ad.id}`,
    images: ad.images ?? [],
    phone: ad.phone ?? null,
    status: `${ad.status ?? JobAdStatus.PUBLISHED}`,
  }));

  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6">
        {/* تیتر صفحه */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">آگهی‌ها</h1>
            <p className="text-sm text-slate-500 mt-1">
              {ads.length === 0
                ? "هیچ آگهی فعالی ثبت نشده است."
                : `${ads.length} آگهی فعال`}
            </p>
          </div>
        </div>

        {/* موبایل: لیست زیر هم */}
        <div className="sm:hidden space-y-3">
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>

        {/* دسکتاپ: گرید چندستونه شبیه دیوار */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      </div>
    </main>
  );
}
