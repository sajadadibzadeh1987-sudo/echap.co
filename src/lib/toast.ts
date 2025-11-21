// lib/toast.ts
import { toast } from "sonner";

// تابع نمایش پیام موفقیت
export const showSuccess = (message: string) => {
  toast.success(message, {
    duration: 3000, // مدت زمان نمایش
    position: "top-center", // مکان پیام
  });
};

// تابع نمایش پیام خطا
export const showError = (message: string) => {
  toast.error(message, {
    duration: 4000,
    position: "top-center",
  });
};
