// src/app/api/ads/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// طبق داکیومنت جدید Next.js، params باید Promise باشه و قبل از استفاده await بشه
type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    // ⬅ اینجا توصیه Next: اول params رو await کن
    const { id } = await params;

    // اگر id وجود نداشته باشد، 400 برگردان
    if (!id) {
      return NextResponse.json(
        { error: "شناسه آگهی نامعتبر است" },
        { status: 400 }
      );
    }

    const ad = await prisma.jobAd.findUnique({
      where: { id },
    });

    // فقط آگهی‌های منتشر شده را برای عموم برگردان
    if (!ad || ad.status !== "PUBLISHED") {
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
