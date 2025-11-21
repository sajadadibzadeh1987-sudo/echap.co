// lib/api.ts
import { showSuccess, showError } from "@/lib/toast";

// تابع API که پیام‌های موفقیت و خطا رو مدیریت می‌کنه
export async function apiCall<T>(promise: Promise<T>, messages?: { success?: string, error?: string }) {
  try {
    const result = await promise;
    if (messages?.success) showSuccess(messages.success);
    return result;
  } catch (err) {
    console.error(err);
    if (messages?.error) showError(messages.error);
    throw err;
  }
}
