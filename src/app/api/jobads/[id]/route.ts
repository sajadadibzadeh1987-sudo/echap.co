import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteImageSafe } from "@/lib/imageFiles";

/* ------------------------------------------------------
   🟩 GET — دریافت یک آگهی بر اساس ID
   (برای صفحه ویرایش تصاویر + نمایش جزئیات)
--------------------------------------------------------*/
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ad = await prisma.jobAd.findUnique({
      where: { id: params.id },
    });

    if (!ad) {
      return NextResponse.json(
        { error: "آگهی پیدا نشد" },
        { status: 404 }
      );
    }

    // جلوگیری از کش شدن
    return new NextResponse(JSON.stringify(ad), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("❌ GET /jobads/[id] error:", error);
    return NextResponse.json(
      { error: "خطای سرور" },
      { status: 500 }
    );
  }
}

/* ------------------------------------------------------
   🟩 PATCH — ویرایش تصاویر آگهی + ساخت thumbnail
--------------------------------------------------------*/
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const jobAd = await prisma.jobAd.findUnique({ where: { id } });
    if (!jobAd) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    if (jobAd.userId !== session.user.id) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const form = await req.formData();

    const existingImages = JSON.parse(
      form.get("existingImages") as string
    ) as string[];

    const mainIndexRaw = form.get("mainImageIndex") as string | null;
    const mainIndex = mainIndexRaw ? Number(mainIndexRaw) : null;

    const newFiles = form
      .getAll("newImages")
      .filter((f) => f instanceof File) as File[];

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const thumbDir = path.join(uploadDir, "thumbs");

    // اطمینان از وجود فولدرها
    await mkdir(uploadDir, { recursive: true });
    await mkdir(thumbDir, { recursive: true });

    // sharp را دینامیک ایمپورت می‌کنیم
    const sharpModule = await import("sharp");
    const sharp = sharpModule.default;

    const newImageUrls: string[] = [];

    for (const file of newFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name) || ".jpg";
      const filename = `${uuidv4()}${ext}`;

      const originalPath = path.join(uploadDir, filename);
      const thumbPath = path.join(thumbDir, filename);

      // ذخیره نسخه اصلی
      await writeFile(originalPath, buffer);

      // ساخت thumbnail (مثلاً حداکثر 400px)
      try {
        await sharp(buffer)
          .resize(400, 400, {
            fit: "inside",
            withoutEnlargement: true,
          })
          .toFile(thumbPath);
      } catch (err) {
        console.warn("⚠️ ساخت thumbnail ناموفق بود:", err);
      }

      // لینک نسخه اصلی در DB ذخیره می‌شود
      newImageUrls.push(`/uploads/${filename}`);
    }

    // تشخیص تصاویر حذف‌شده
    const removedImages = jobAd.images.filter(
      (img) => !existingImages.includes(img)
    );

    // حذف امن تصاویر قدیمی (اصل + thumbnail) از طریق deleteImageSafe
    if (removedImages.length > 0) {
      await Promise.all(removedImages.map((img) => deleteImageSafe(img)));
    }

    let finalImages = [...existingImages, ...newImageUrls];

    // قرار دادن تصویر اصلی در ابتدای آرایه
    if (
      mainIndex !== null &&
      mainIndex >= 0 &&
      mainIndex < finalImages.length
    ) {
      const mainImg = finalImages[mainIndex];
      finalImages = [
        mainImg,
        ...finalImages.filter((img, i) => i !== mainIndex),
      ];
    }

    const updated = await prisma.jobAd.update({
      where: { id },
      data: { images: finalImages },
    });

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error("❌ PATCH /jobads/[id] error:", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

/* ------------------------------------------------------
   🟥 DELETE — حذف آگهی + حذف تصاویر از سرور (با deleteImageSafe)
--------------------------------------------------------*/
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const jobAd = await prisma.jobAd.findUnique({
      where: { id: params.id },
    });

    if (!jobAd) {
      return NextResponse.json(
        { error: "آگهی پیدا نشد" },
        { status: 404 }
      );
    }

    // فقط صاحب آگهی حق حذف دارد
    if (jobAd.userId !== session.user.id) {
      return NextResponse.json(
        { error: "forbidden" },
        { status: 403 }
      );
    }

    const images = jobAd.images ?? [];

    // حذف امن تمام فایل‌های مرتبط با این آگهی از VPS
    await Promise.all(images.map((img) => deleteImageSafe(img)));

    // حذف رکورد آگهی از دیتابیس
    await prisma.jobAd.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ DELETE jobAd error:", error);
    return NextResponse.json(
      { error: "حذف ناموفق بود" },
      { status: 500 }
    );
  }
}
