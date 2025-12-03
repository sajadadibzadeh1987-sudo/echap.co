// src/app/api/admin/ads/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { Prisma, JobAdStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // دسترسی فقط برای SUPER_ADMIN
    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");   // مثال: PENDING
    const category = searchParams.get("category"); // مثال: printing

    // ✅ از نوع رسمی Prisma استفاده می‌کنیم
    const where: Prisma.JobAdWhereInput = {};

    if (status && status !== "ALL") {
      // status رشته است؛ آن را به JobAdStatus cast می‌کنیم
      where.status = status as JobAdStatus;
    }

    if (category && category !== "ALL") {
      where.categorySlug = category;
    }

    // گرفتن لیست آگهی‌ها از قدیمی‌ترین (asc)
    const ads = await prisma.jobAd.findMany({
      where,
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        status: true,
        phone: true,
        moderationNote: true,
        isDeleted: true,
        categorySlug: true,
      },
    });

    return NextResponse.json({ ads }, { status: 200 });
  } catch (error) {
    console.error("❌ GET /api/admin/ads error:", error);
    return NextResponse.json(
      { error: "خطا در دریافت لیست آگهی‌ها" },
      { status: 500 }
    );
  }
}
