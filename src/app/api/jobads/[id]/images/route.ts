// src/app/api/jobads/[id]/images/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { normalizeToFilename } from "@/lib/imageFiles";
import { deleteImageSafe } from "@/lib/imageFilesServer";


export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobAdId = params.id;

    // Body باید شکلی مثل { images: string[] } داشته باشد
    const body = await req.json();
    const incomingImages = (body.images ?? []) as string[];

    // آگهی فعلی را از دیتابیس بگیریم
    const jobAd = await prisma.jobAd.findUnique({
      where: { id: jobAdId },
      select: { images: true },
    });

    if (!jobAd) {
      return NextResponse.json(
        { error: "آگهی یافت نشد" },
        { status: 404 }
      );
    }

    const oldImages: string[] = jobAd.images ?? [];

    // نرمال‌سازی رشته‌ها برای مقایسه
    const oldNorm: string[] = oldImages.map((img: string) =>
      normalizeToFilename(img)
    );
    const newNorm: string[] = incomingImages.map((img: string) =>
      normalizeToFilename(img)
    );

    // تصاویری که قبلاً بودند، الان نیستند → باید حذف شوند
    const toDelete: string[] = oldNorm.filter(
      (oldImg: string) => !newNorm.includes(oldImg)
    );

    // حذف فیزیکی فایل‌ها از VPS
    await Promise.all(
      toDelete.map((img: string) => deleteImageSafe(img))
    );

    // ذخیره‌ی لیست جدید در DB (به‌صورت نرمال‌شده)
    const updated = await prisma.jobAd.update({
      where: { id: jobAdId },
      data: {
        images: newNorm,
      },
    });

    return NextResponse.json({
      success: true,
      images: updated.images,
    });
  } catch (error: unknown) {
    console.error("PATCH /api/jobads/[id]/images error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "خطای غیرمنتظره در ویرایش تصاویر آگهی";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
