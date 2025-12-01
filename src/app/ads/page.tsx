// src/app/ads/page.tsx

import { Suspense } from "react";
import prisma from "@/lib/prisma";
import AdCard from "@/components/AdCard";
import AdsFilterSidebar from "@/components/ad/AdsFilterSidebar";
import { JobAd, JobAdStatus, Prisma } from "@prisma/client";

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

export interface AdsPageSearchParams {
  q?: string;
  group?: string;
  category?: string;
  hasImage?: string;
  page?: string;
}

/**
 * در Next.js جدید، searchParams به صورت Promise می‌آید،
 * بنابراین اینجا یک‌بار await می‌کنیم.
 */
interface AdsPageProps {
  searchParams: Promise<AdsPageSearchParams>;
}

export default async function AdsPage({ searchParams }: AdsPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <main className="min-h-screen bg-gray-50 overflow-x-hidden" dir="rtl">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6">
        {/* تیتر صفحه */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">آگهی‌ها</h1>
            <p className="mt-1 text-sm text-slate-500">
              انواع آگهی‌های مرتبط با صنعت چاپ و مشاغل وابسته
            </p>
          </div>
        </div>

        {/* چیدمان اصلی:
            - در دسکتاپ: ستون فیلتر سمت راست، لیست آگهی‌ها سمت چپ
        */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* ستون فیلتر – چون در RTL اولین آیتم flex-row است، سمت راست قرار می‌گیرد */}
          <div className="w-full shrink-0 lg:w-72 xl:w-80">
            <AdsFilterSidebar
              currentGroup={resolvedSearchParams.group}
              currentCategory={resolvedSearchParams.category}
              keyword={resolvedSearchParams.q}
              hasImage={resolvedSearchParams.hasImage === "1"}
            />
          </div>

          {/* ستون اصلی: لیست آگهی‌ها */}
          <div className="flex-1">
            <Suspense fallback={<AdsListSkeleton />}>
              <AdsList searchParams={resolvedSearchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ------------------------ لیست آگهی‌ها (Server Component) ------------------------ */

async function AdsList({
  searchParams,
}: {
  searchParams: AdsPageSearchParams;
}) {
  const { q, group, category, hasImage } = searchParams;

  // ساخت where به صورت immutable و بدون any
  const where: Prisma.JobAdWhereInput = {
    status: JobAdStatus.PUBLISHED,
    ...(q && q.trim() !== ""
      ? {
          OR: [
            { title: { contains: q.trim(), mode: "insensitive" } },
            { description: { contains: q.trim(), mode: "insensitive" } },
          ],
        }
      : {}),
    // فعلاً backend فقط بر اساس category واقعی جدول فیلتر می‌کند
    ...(category
      ? {
          category,
        }
      : {}),
    ...(hasImage === "1"
      ? {
          images: {
            isEmpty: false,
          },
        }
      : {}),
  };

  const rawAds: JobAd[] = await prisma.jobAd.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 40,
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

  const hasFilters =
    !!(q && q.trim() !== "") ||
    !!group || // group فعلاً فقط در UI استفاده می‌شود، نه در فیلتر DB
    !!category ||
    hasImage === "1";

  const isCategoryFilter = !!category;

  // متن وضعیت بالای لیست
  const headerText =
    ads.length === 0
      ? isCategoryFilter
        ? "هیچ آگهی فعالی در این دسته ثبت نشده است."
        : hasFilters
        ? "نتیجه‌ای برای فیلترهای فعلی پیدا نشد."
        : "هیچ آگهی فعالی ثبت نشده است."
      : `${ads.length} آگهی فعال`;

  return (
    <>
      <div className="mb-3 flex items-center justify-between text-[13px] text-gray-600 lg:text-[14px]">
        <div>
          <span className="font-medium text-gray-800">{headerText}</span>
          {hasFilters && ads.length > 0 && (
            <span className="mr-2 text-[11px] text-gray-500">
              (با فیلترهای انتخاب شده)
            </span>
          )}
        </div>
      </div>

      {ads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-10 text-center text-sm text-gray-600">
          <p>
            {isCategoryFilter
              ? "در حال حاضر هیچ آگهی‌ای در این دسته ثبت نشده است."
              : hasFilters
              ? "نتیجه‌ای برای فیلترهای فعلی پیدا نشد."
              : "هنوز هیچ آگهی فعالی در سیستم ثبت نشده است."}
          </p>
          {hasFilters && (
            <p className="mt-1 text-xs text-gray-500">
              فیلترها را تغییر دهید یا کلمه جستجو را ساده‌تر کنید.
            </p>
          )}
        </div>
      ) : (
        <>
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
        </>
      )}
    </>
  );
}

/* --------------------------- لودر هنگام فیلتر --------------------------- */

function Spinner() {
  return (
    <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-gray-300 border-t-gray-900" />
  );
}

function AdsListSkeleton() {
  return (
    <div className="flex min-h-[220px] items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-[12px] text-gray-500">
        <Spinner />
        <span>در حال به‌روزرسانی آگهی‌ها...</span>
      </div>
    </div>
  );
}
