import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

// 🟢 متادیتا برای تایتل صفحه آگهی
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { id } = (await params) || params;

  const ad = await prisma.jobAd.findUnique({
    where: { id },
    select: { title: true },
  });

  return {
    title: ad ? ad.title : "آگهی یافت نشد",
  };
}

// 🟢 صفحه جزئیات آگهی
export default async function AdDetailPage({ params }: any) {
  const { id } = (await params) || params;

  const ad = await prisma.jobAd.findUnique({
    where: { id },
  });

  if (!ad) return notFound();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded mt-6" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">{ad.title}</h1>
      <p className="text-gray-700 mb-2">{ad.description}</p>
      <div className="text-sm text-gray-500 mb-1">دسته‌بندی: {ad.category}</div>
      <div className="text-sm text-gray-500">شماره تماس: {ad.phone}</div>
      <div className="text-xs text-gray-400 mt-4">
        ثبت شده در: {new Date(ad.createdAt).toLocaleDateString("fa-IR")}
      </div>
    </div>
  );
}
