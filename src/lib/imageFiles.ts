// src/lib/imageFiles.ts
import fs from "fs/promises";
import path from "path";

/**
 * ورودی می‌تونه یکی از این حالت‌ها باشه:
 *  - "f1.jpg"
 *  - "uploads/f1.jpg"
 *  - "/uploads/f1.jpg"
 *  - "public/uploads/f1.jpg"
 * خروجی همیشه می‌شه فقط: "f1.jpg"
 */
export function normalizeToFilename(raw: string): string {
  let v = (raw || "").trim();

  if (!v) return "";

  if (v.startsWith("public/")) {
    v = v.slice("public/".length);
  }

  if (v.startsWith("/")) {
    v = v.slice(1);
  }

  if (v.startsWith("uploads/")) {
    v = v.slice("uploads/".length);
  }

  return v;
}

/**
 * از روی filename، آدرس public می‌سازد (برای نمایش در فرانت)
 * مثال: "f1.jpg" → "/uploads/f1.jpg"
 */
export function buildPublicImageSrc(value: string): string {
  const filename = normalizeToFilename(value);
  if (!filename) return "/placeholder.png";
  return `/uploads/${filename}`;
}

/**
 * آدرس absolut روی دیسک، برای وقتی بعداً خواستیم فایل رو حذف کنیم
 * مثال: "f1.jpg" → /project-root/public/uploads/f1.jpg
 */
export function getAbsoluteImagePath(value: string): string {
  const filename = normalizeToFilename(value);
  return path.join(process.cwd(), "public", "uploads", filename);
}

/**
 * حذف امن فایل (اگر وجود نداشت، ارور جدی نده)
 */
export async function deleteImageSafe(value: string): Promise<void> {
  try {
    const abs = getAbsoluteImagePath(value);
    await fs.unlink(abs);
  } catch (err: unknown) {
    const error = err as NodeJS.ErrnoException;

    // اگر فایل وجود نداشت (ENOENT)، نادیده بگیر
    if (error.code !== "ENOENT") {
      console.error("Error deleting image:", value, error.message);
    }
  }
}
