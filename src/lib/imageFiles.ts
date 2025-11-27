// src/lib/imageFiles.ts
// این فایل باید هم در کلاینت و هم در سرور قابل استفاده باشد
// بنابراین هیچ استفاده‌ای از fs یا path در آن نداریم.

export type ImageVariant = "original" | "thumb"

/**
 * نرمال‌سازی نام فایل از انواع ورودی‌ها:
 * - URL کامل
 * - مسیر /uploads/...
 * - مسیر public/uploads/...
 */
export function normalizeToFilename(value: string | undefined | null): string {
  if (!value) return ""

  let v = value.trim()

  // اگر URL کامل باشد
  if (v.startsWith("http://") || v.startsWith("https://")) {
    try {
      const url = new URL(v)
      v = url.pathname
    } catch {
      // اگر URL نامعتبر بود، همان را برمی‌گردانیم
      return v
    }
  }

  // حذف / ابتدایی
  if (v.startsWith("/")) v = v.slice(1)

  // حذف پوشه public/
  if (v.startsWith("public/")) v = v.slice("public/".length)

  // حذف uploads/ ابتدایی تا فقط نام فایل بماند
  if (v.startsWith("uploads/")) v = v.slice("uploads/".length)

  return v
}

/**
 * ساخت آدرس عمومی برای نمایش تصویر در سایت
 * (برای original و thumbnail)
 */
export function buildPublicImageSrc(
  value: string | undefined | null,
  variant: ImageVariant = "original"
): string {
  if (!value) return "/placeholder.png"

  // اگر لینک کامل اینترنتی باشد
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value
  }

  let filename = normalizeToFilename(value)
  if (!filename) return "/placeholder.png"

  // اگر thumbnail خواستیم، پسوند _thumb اضافه می‌کنیم
  if (variant === "thumb") {
    const dot = filename.lastIndexOf(".")
    if (dot >= 0) {
      filename = filename.slice(0, dot) + "_thumb" + filename.slice(dot)
    } else {
      filename = filename + "_thumb"
    }
  }

  return `/uploads/${filename}`
}
