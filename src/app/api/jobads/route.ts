// src/app/api/jobads/route.ts
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

// باید با enum EmploymentType در schema برابر باشه
const EMPLOYMENT_TYPES = [
  "FULL_TIME",
  "PART_TIME",
  "PROJECT",
  "REMOTE",
] as const;

type EmploymentTypeValue = (typeof EMPLOYMENT_TYPES)[number];

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

    // 🔹 فیلدهای مخصوص استخدام / آماده‌به‌کار
    const employmentTypeRaw = formData.get("employmentType") as string | null;
    const salary = formData.get("salary") as string | null;
    const salaryNegotiableRaw = formData.get(
      "salaryNegotiable"
    ) as string | null;

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

    const groupUpper = group ? group.toUpperCase() : "";
    const isEmploymentLike =
      groupUpper === "EMPLOYMENT" || groupUpper === "READY_TO_WORK";

    const isSalaryNegotiable = salaryNegotiableRaw === "true";

    let employmentType: EmploymentTypeValue | null = null;

    if (isEmploymentLike) {
      if (!employmentTypeRaw || !employmentTypeRaw.trim()) {
        return NextResponse.json(
          { error: "برای آگهی‌های استخدام، نوع همکاری را مشخص کنید" },
          { status: 400 }
        );
      }

      const upper = employmentTypeRaw.trim().toUpperCase();
      if (!EMPLOYMENT_TYPES.includes(upper as EmploymentTypeValue)) {
        return NextResponse.json(
          { error: "نوع همکاری معتبر نیست" },
          { status: 400 }
        );
      }

      employmentType = upper as EmploymentTypeValue;
    }

    const finalSalary =
      isEmploymentLike && isSalaryNegotiable
        ? "توافقی"
        : salary?.trim() || null;

    const files = formData
      .getAll("images")
      .filter((f): f is File => f instanceof File);

    const limitedFiles = files.slice(0, MAX_FILES);

    // ✅ ولیدیشن تصاویر
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

    // ✅ اگر هیچ تصویری ارسال نشده
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
          employmentType,
          salary: finalSalary,
        },
      });

      try {
        await prisma.chatMessage.create({
          data: {
            userId: session.user.id,
            sender: "SYSTEM",
            text: `آگهی «${title}» با موفقیت ثبت شد و در صف بررسی قرار گرفت.`,
            jobAdId: jobAd.id,
          },
        });
      } catch (err) {
        console.warn("⚠️ خطا در ساخت پیام روبات برای آگهی بدون تصویر:", err);
      }

      return NextResponse.json(jobAd, { status: 201 });
    }

    // ✅ ذخیره تصاویر (نسخه اصلی + ساخت thumbnail روی دیسک)
    const imageUrls: string[] = await Promise.all(
      limitedFiles.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const ext = path.extname(file.name) || ".jpg";
        const filename = `${uuidv4()}${ext}`;

        const filepath = path.join(uploadDir, filename);
        const thumbPath = path.join(thumbDir, filename);

        // ذخیره نسخه اصلی
        await writeFile(filepath, buffer);

        // ساخت thumbnail کوچک (مثل دیوار)
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

    // ✅ جابجا کردن ترتیب بر اساس mainImageIndex
    const mainImageIndex = mainImageIndexRaw
      ? parseInt(mainImageIndexRaw, 10)
      : null;

    let finalImages = [...imageUrls];

    if (
      mainImageIndex !== null &&
      !Number.isNaN(mainImageIndex) &&
      mainImageIndex >= 0 &&
      mainImageIndex < imageUrls.length
    ) {
      const mainImage = imageUrls[mainImageIndex];
      finalImages = [
        mainImage,
        ...imageUrls.filter((_, i) => i !== mainImageIndex),
      ];
    }

    // ✅ ساخت آگهی در حالت PENDING
    const jobAd = await prisma.jobAd.create({
      data: {
        title,
        description,
        category,
        phone,
        userId: session.user.id,
        images: finalImages,
        status: "PENDING",
        group,
        categorySlug,
        employmentType,
        salary: finalSalary,
      },
    });

    try {
      await prisma.chatMessage.create({
        data: {
          userId: session.user.id,
          sender: "SYSTEM",
          text: `آگهی «${title}» با موفقیت ثبت شد و در صف بررسی قرار گرفت.`,
          jobAdId: jobAd.id,
        },
      });
    } catch (err) {
      console.warn("⚠️ خطا در ساخت پیام روبات برای آگهی:", jobAd.id, err);
    }

    return NextResponse.json(jobAd, { status: 201 });
  } catch (error) {
    console.error("❌ خطا در ثبت آگهی:", error);
    return NextResponse.json(
      { error: "خطای غیرمنتظره در ثبت آگهی" },
      { status: 500 }
    );
  }
}
