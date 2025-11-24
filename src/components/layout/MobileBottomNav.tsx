// src/components/layout/MobileBottomNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User2, PlusCircle, Megaphone, ListChecks } from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();

  // ترتیب آرایه بر اساس چپ → راست (چون جهت را LTR می‌کنیم):
  // [نیازمندی‌ها, آگهی‌ها, خانه, درج آگهی, پروفایل]
  // پس راست‌ترین = پروفایل، چپ‌ترین = نیازمندی‌ها
  const items = [
    { href: "/ads", label: "نیازمندی‌ها", icon: ListChecks },
    { href: "/dashboard/jobads/my", label: "آگهی‌ها", icon: Megaphone },
    { href: "/", label: "خانه", icon: Home, emphasize: true },
    { href: "/dashboard/jobads/create", label: "درج آگهی", icon: PlusCircle },
    { href: "/dashboard", label: "پروفایل", icon: User2 },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="
        fixed bottom-0 inset-x-0 z-40
        md:hidden
        bg-white/95 backdrop-blur
        border-t border-gray-200
      "
      // ❗ جهت فلکس و چیدمان را LTR می‌کنیم تا ترتیب دقیقاً مطابق آرایه باشد
      style={{ direction: "ltr" }}
    >
      <div className="max-w-md mx-auto px-2 py-1">
        <div className="flex justify-between gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            const baseStyle =
              "flex flex-col items-center justify-center transition transform active:scale-95"; // scaleOnClick 🔥

            const sizeStyle = item.emphasize
              ? "flex-[1.2] py-2 px-3 rounded-2xl"
              : "flex-1 py-1.5 rounded-xl";

            const colorStyle = active
              ? "bg-gray-900 text-white"
              : "text-gray-600 hover:bg-gray-100";

            const iconSize = item.emphasize ? "w-6 h-6" : "w-5 h-5";

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${baseStyle} ${sizeStyle} ${colorStyle}`}
              >
                <Icon className={`${iconSize} mb-0.5`} />
                {/* متن هر آیتم RTL باشد که فارسی درست نمایش داده شود */}
                <span className="text-[11px] leading-none" dir="rtl">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
