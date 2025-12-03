// src/app/api/admin/ads/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    // فقط سوپر ادمین اجازه دیدن جزئیات آگهی را دارد
    const user = session?.user as { id?: string; role?: string } | null;

    if (!user?.id || user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // ❗ اینجا هیچ فیلتر status / isDeleted نمی‌گذاریم
    // چون ادمین باید بتواند آگهی‌های PENDING / REJECTED / DELETED را هم ببیند
    const ad = await prisma.jobAd.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });

    if (!ad) {
      return NextResponse.json(
        { error: "آگهی پیدا نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json(ad, { status: 200 });
  } catch (error) {
    console.error("❌ GET /api/admin/ads/[id] error:", error);
    return NextResponse.json(
      { error: "خطای سرور در دریافت آگهی" },
      { status: 500 }
    );
  }
}
