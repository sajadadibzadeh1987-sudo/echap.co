import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // غیرفعال کردن پارسر خودکار
  },
};

export async function POST(req: Request) {
  try {
    // 1. پارس خودکار فرم‌دیتا
    const formData = await req.formData();

    // 2. گرفتن فیلد file
    const file = formData.get("file");
    // حتماً <input name="file"> در فرم داشته باشید!
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "فایلی برای آپلود ارسال نشده" },
        { status: 400 }
      );
    }

    // 3. تولید نام یکتا برای فایل
    const timestamp = Date.now();
    // File از Web API شامل .name و .arrayBuffer است
    const filename = `${timestamp}-${file.name}`;

    // 4. خواندن باینری و نوشتن روی دیسک
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    // 5. برگرداندن URL
    const fileUrl = `/uploads/${filename}`;
    return NextResponse.json({ url: fileUrl }, { status: 200 });
  } catch (err) {
    console.error("❌ Upload error:", err);
    return NextResponse.json(
      { error: "خطا در آپلود فایل" },
      { status: 500 }
    );
  }
}
