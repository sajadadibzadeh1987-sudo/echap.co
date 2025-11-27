// src/app/api/ads/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const ad = await prisma.jobAd.findUnique({
      where: { id },
    });

    // اگر پیدا نشد یا منتشر نشده
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
