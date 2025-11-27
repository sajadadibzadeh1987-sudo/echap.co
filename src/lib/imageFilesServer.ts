// src/lib/imageFilesServer.ts
// فقط برای استفاده در سرور (Route های API و ...)

import fs from "fs/promises"
import path from "path"
import { normalizeToFilename } from "./imageFiles"

/**
 * حذف امن یک فایل تصویر از پوشه public/uploads
 */
export async function deleteImageSafe(value: string | undefined | null): Promise<void> {
  if (!value) return

  try {
    const filename = normalizeToFilename(value)
    if (!filename) return

    const abs = path.join(process.cwd(), "public", "uploads", filename)
    await fs.unlink(abs)
  } catch (err: unknown) {
    const anyErr = err as { code?: string; message?: string }
    if (anyErr?.code !== "ENOENT") {
      console.error("Error deleting image:", value, anyErr?.message ?? err)
    }
    // اگر فایل نبود (ENOENT)، ساکت می‌مانیم
  }
}
