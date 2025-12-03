// src/app/api/ads/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    // برای سازگاری با Next 15
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await params;

    const ad = await prisma.jobAd.findUnique({
      where: { id },
    });

    // فقط آگهی‌های منتشر شده و حذف‌نشده را برای عموم برگردان
    if (!ad || ad.status !== "PUBLISHED" || ad.isDeleted) {
      return NextResponse.json(
        { error: "آگهی پیدا نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json(ad, { status: 200 });
  } catch (error) {
    console.error("❌ GET /api/ads/[id] error:", error);
    return NextResponse.json(
      { error: "خطای سرور در دریافت آگهی" },
      { status: 500 }
    );
  }
}
