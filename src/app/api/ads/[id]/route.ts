// src/app/api/ads/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RouteParams = {
  params?: {
    id?: string;
  };
};

export async function GET(_req: NextRequest, context: RouteParams) {
  try {
    const id = context?.params?.id;

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

    // فقط آگهی‌های منتشرشده را برای عموم برگردان
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
      { error: "خطای سرور در بارگذاری آگهی" },
      { status: 500 }
    );
  }
}
