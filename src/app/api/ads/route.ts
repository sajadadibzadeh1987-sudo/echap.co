// src/app/api/ads/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const ads = await prisma.jobAd.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(ads, { status: 200 });
  } catch (error) {
    console.error("❌ GET /api/ads error:", error);
    return NextResponse.json(
      { error: "خطای سرور در دریافت آگهی‌ها" },
      { status: 500 }
    );
  }
}
