// app/api/jobads/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const category = formData.get("category") as string | null;
    const phone = formData.get("phone") as string | null;
    const mainImageIndexRaw = formData.get("mainImageIndex") as string | null;

    if (!title || !description || !category || !phone) {
      return NextResponse.json(
        { error: "اطلاعات فرم ناقص است" },
        { status: 400 }
      );
    }

    // گرفتن فایل‌ها
    const files = formData
      .getAll("images")
      .filter((f): f is File => f instanceof File);

    // محدود کردن تعداد
    const limitedFiles = files.slice(0, MAX_FILES);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const imageUrls: string[] = [];

    for (const file of limitedFiles) {
      // چک کردن نوع فایل
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: "فرمت تصویر مجاز نیست (فقط JPG/PNG/WEBP/GIF/AVIF)" },
          { status: 400 }
        );
      }

      // چک کردن سایز فایل
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "حجم هر تصویر نباید بیشتر از ۵ مگابایت باشد" },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name) || ".jpg";
      const filename = `${uuidv4()}${ext}`;
      const filepath = path.join(uploadDir, filename);

      await writeFile(filepath, buffer);

      imageUrls.push(`/uploads/${filename}`);
    }

    // اگر هیچ عکسی هم ارسال نشود، مشکلی نیست.
    let finalImageUrls = [...imageUrls];

    // پردازش تصویر اصلی بر اساس ایندکس
    const mainImageIndex = mainImageIndexRaw
      ? parseInt(mainImageIndexRaw, 10)
      : null;

    if (
      mainImageIndex !== null &&
      !isNaN(mainImageIndex) &&
      mainImageIndex >= 0 &&
      mainImageIndex < imageUrls.length
    ) {
      const mainImage = imageUrls[mainImageIndex];
      finalImageUrls = [
        mainImage,
        ...imageUrls.filter((_, i) => i !== mainImageIndex),
      ];
    }

    const jobAd = await prisma.jobAd.create({
      data: {
        title,
        description,
        category,
        phone,
        userId: session.user.id,
        images: finalImageUrls,
      },
    });

    return NextResponse.json(jobAd, { status: 201 });
  } catch (error) {
    console.error("❌ خطا در ثبت آگهی:", error);
    return NextResponse.json(
      { error: "خطای غیرمنتظره در ثبت آگهی" },
      { status: 500 }
    );
  }
}
