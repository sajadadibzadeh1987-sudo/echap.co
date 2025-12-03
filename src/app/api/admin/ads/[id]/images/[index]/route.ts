// src/app/api/admin/ads/[id]/images/[index]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string; index: string }>;
  }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    const { id, index } = await params;
    const idx = Number(index);

    if (!Number.isInteger(idx) || idx < 0) {
      return NextResponse.json(
        { error: "ایندکس تصویر نامعتبر است." },
        { status: 400 }
      );
    }

    const ad = await prisma.jobAd.findUnique({
      where: { id },
      select: { images: true },
    });

    if (!ad) {
      return NextResponse.json(
        { error: "آگهی پیدا نشد." },
        { status: 404 }
      );
    }

    const images = ad.images ?? [];

    if (idx >= images.length) {
      return NextResponse.json(
        { error: "تصویر مورد نظر وجود ندارد." },
        { status: 404 }
      );
    }

    const newImages = images.filter((_, i) => i !== idx);

    await prisma.jobAd.update({
      where: { id },
      data: {
        images: newImages,
      },
    });

    return NextResponse.json(
      { message: "تصویر با موفقیت حذف شد." },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "❌ DELETE /api/admin/ads/[id]/images/[index] error:",
      error
    );
    return NextResponse.json(
      { error: "خطای سرور در حذف تصویر" },
      { status: 500 }
    );
  }
}
