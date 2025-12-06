"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { X, LogOut } from "lucide-react";

import { useProfilePanelStore } from "@/store/useProfilePanelStore";
import {
  useProfileInfoSheetStore,
  type ProfileInfoType,
} from "@/store/useProfileInfoSheetStore";

type MenuItem = {
  id: string;
  label: string;
  href?: string;
  isDanger?: boolean;
};

// ==============================
// 📌 منوی اصلی پروفایل
// ==============================
const PROFILE_MENU_ITEMS: MenuItem[] = [
  {
    id: "logout",
    label: "خروج از حساب کاربری",
    isDanger: true,
  },
  {
    id: "my-ads",
    label: "آگهی‌های من",
    href: "/dashboard/jobads/my", // 🔥 مسیر درست داشبورد
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
  },
  {
    id: "rules",
    label: "قوانین ایچاپ",
  },
  {
    id: "about",
    label: "درباره ایچاپ",
  },
];

export default function ProfilePanel() {
  const { isOpen, close } = useProfilePanelStore();
  const router = useRouter();

  const { open: openInfoSheet } = useProfileInfoSheetStore();

  // جلوگیری از اسکرول پس‌زمینه هنگام باز بودن پنل
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleInfoOpen = (type: ProfileInfoType) => {
    openInfoSheet(type);
  };

  const handleItemClick = async (item: MenuItem) => {
    // خروج از حساب
    if (item.id === "logout") {
      await signOut({ callbackUrl: "/" });
      close();
      return;
    }

    // قوانین / پشتیبانی / درباره ایچاپ → شیت اطلاعات
    if (item.id === "rules") {
      handleInfoOpen("rules");
      return;
    }

    if (item.id === "support") {
      handleInfoOpen("support");
      return;
    }

    if (item.id === "about") {
      handleInfoOpen("about");
      return;
    }

    // سایر موارد → ناوبری معمولی
    if (item.href) {
      router.push(item.href);
    }

    close();
  };

  return (
    <div
      className={`fixed inset-0 z-[60] transition-opacity duration-200 ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {/* بک‌درپ پشت پنل */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={close}
        aria-hidden="true"
      />

      {/* شیت اصلی پروفایل */}
      <div
        className={`
          absolute inset-x-0 bottom-0 top-0
          bg-white dark:bg-neutral-900
          rounded-t-2xl md:rounded-none
          shadow-2xl flex flex-col
          max-h-[100vh]
          transition-transform duration-250
          ${isOpen ? "translate-y-0" : "translate-y-full"}
        `}
        dir="rtl"
      >
        {/* هدر پنل */}
        <div className="pt-2 pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between px-4">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                پروفایل من
              </span>
              <span className="text-xs text-neutral-500">
                مدیریت حساب، آگهی‌ها و تنظیمات ایچاپ
              </span>
            </div>

            <button
              onClick={close}
              className="p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="بستن"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="px-4 mt-2 text-[11px] text-neutral-500 leading-relaxed">
            شما با شماره موبایل خود وارد شده‌اید و می‌توانید آگهی‌ها، تنظیمات و
            اطلاعات حساب کاربری را در این بخش مدیریت کنید.
          </p>
        </div>

        {/* لیست آیتم‌ها */}
        <div className="flex-1 overflow-y-auto">
          <ul className="flex flex-col">
            {PROFILE_MENU_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className={`
                    w-full flex items-center justify-between gap-2
                    px-4 py-3 text-sm border-b border-neutral-100 dark:border-neutral-800
                    hover:bg-neutral-50 dark:hover:bg-neutral-800/60
                    ${
                      item.isDanger
                        ? "text-red-600 dark:text-red-400"
                        : "text-neutral-800 dark:text-neutral-100"
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    {item.id === "logout" && <LogOut className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </span>

                  <span className="text-neutral-400 text-xs">
                    {item.id === "logout" ? "" : "›"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* نسخه پایین */}
        <div className="px-4 py-3 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
          <span>نسخه 04V01</span>
          <span>© {new Date().getFullYear()} Echap</span>
        </div>
      </div>
    </div>
  );
}
