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

    const group = formData.get("group") as string | null;
    const categorySlug = formData.get("categorySlug") as string | null;

    if (!title || !description || !category || !phone) {
      return NextResponse.json(
        { error: "اطلاعات فرم ناقص است" },
        { status: 400 }
      );
    }

    if (!group || !categorySlug) {
      return NextResponse.json(
        { error: "دسته‌بندی آگهی به درستی ارسال نشده است" },
        { status: 400 }
      );
    }

    const files = formData
      .getAll("images")
      .filter((f): f is File => f instanceof File);

    const limitedFiles = files.slice(0, MAX_FILES);

    for (const file of limitedFiles) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: "فرمت تصویر مجاز نیست (فقط JPG/PNG/WEBP/GIF/AVIF)" },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "حجم هر تصویر نباید بیشتر از ۵ مگابایت باشد" },
          { status: 400 }
        );
      }
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const thumbDir = path.join(uploadDir, "thumbs");

    await mkdir(uploadDir, { recursive: true });
    await mkdir(thumbDir, { recursive: true });

    const sharpModule = await import("sharp");
    const sharp = sharpModule.default;

    // ۱) اگر اصلاً عکسی نیست
    if (limitedFiles.length === 0) {
      const jobAd = await prisma.jobAd.create({
        data: {
          title,
          description,
          category,
          phone,
          userId: session.user.id,
          images: [],
          status: "PENDING",
          group,
          categorySlug,
        },
      });

      // 💬 پیام روبات ایچاپ
      await prisma.chatMessage.create({
        data: {
          userId: session.user.id,
          sender: "SYSTEM",
          text: `آگهی «${title}» با موفقیت ثبت شد و در صف بررسی قرار گرفت.`,
          jobAdId: jobAd.id,
        },
      });

      return NextResponse.json(jobAd, { status: 201 });
    }

    // ۲) ذخیره تصاویر
    const imageUrls: string[] = await Promise.all(
      limitedFiles.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = path.extname(file.name) || ".jpg";
        const filename = `${uuidv4()}${ext}`;

        const filepath = path.join(uploadDir, filename);
        const thumbPath = path.join(thumbDir, filename);

        await writeFile(filepath, buffer);

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

        return `/uploads/${filename}`;
      })
    );

    let finalImageUrls = [...imageUrls];

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

    // ۳) ساخت آگهی در حالت PENDING
    const baseAd = await prisma.jobAd.create({
      data: {
        title,
        description,
        category,
        phone,
        userId: session.user.id,
        images: [],
        status: "PENDING",
        group,
        categorySlug,
      },
    });

    // ۴) آپدیت تصاویر
    const jobAd = await prisma.jobAd.update({
      where: { id: baseAd.id },
      data: {
        images: finalImageUrls,
      },
    });

    // 💬 پیام روبات
    await prisma.chatMessage.create({
      data: {
        userId: session.user.id,
        sender: "SYSTEM",
        text: `آگهی «${title}» با موفقیت ثبت شد و در صف بررسی قرار گرفت.`,
        jobAdId: jobAd.id,
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
