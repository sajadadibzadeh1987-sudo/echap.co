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

    const body = await req.json();
    const incomingImages = (body.images ?? []) as string[];

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

    await Promise.all(
      toDelete.map((img: string) => deleteImageSafe(img))
    );

    // در DB نسخه نرمال‌شده ذخیره می‌کنیم (سازگار با بقیه utilها)
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
