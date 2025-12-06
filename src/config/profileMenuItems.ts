// src/config/profileMenuItems.ts

// فقط ساختار داده؛ بدون JSX و بدون آیکن
export type ProfileMenuItem = {
  id: string;
  label: string;
  href?: string;        // لینک صفحه مربوطه
  onClickId?: string;   // برای اکشن‌هایی مثل logout اگر خواستی استفاده کنی
  isDanger?: boolean;   // آیتم‌های قرمز مثل خروج
};

export const PROFILE_MENU_ITEMS: ProfileMenuItem[] = [
  {
    id: "logout",
    label: "خروج از حساب کاربری",
    onClickId: "logout",
    isDanger: true,
  },
  {
    id: "my-ads",
    label: "آگهی‌های من",
    href: "/dashboard/jobads",
  },
  {
    id: "favorites",
    label: "نشان‌شده‌ها",
    href: "/dashboard/favorites",
  },
  {
    id: "followed-businesses",
    label: "کسب‌وکارهای دنبال‌شده",
    href: "/dashboard/following",
  },
  {
    id: "recent-views",
    label: "آخرین بازدیدها",
    href: "/dashboard/recent",
  },
  {
    id: "verification",
    label: "احراز هویت",
    href: "/dashboard/verification",
  },
  {
    id: "settings",
    label: "تنظیمات (تم صفحه)",
    href: "/dashboard/settings",
  },
  {
    id: "support",
    label: "پشتیبانی",
    href: "/support",
  },
  {
    id: "rules",
    label: "قوانین ایچاپ",
    href: "/rules",
  },
  {
    id: "about",
    label: "درباره ایچاپ",
    href: "/about",
  },
];
