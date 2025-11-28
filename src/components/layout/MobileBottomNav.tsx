// src/components/layout/MobileBottomNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User2, PlusCircle, Megaphone, ListChecks } from "lucide-react";
import { useSession } from "next-auth/react";
import useModalStore from "@/hooks/use-modal-store";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { openModal } = useModalStore();

  const isLoggedIn = !!session?.user;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const baseStyle =
    "flex flex-col items-center justify-center transition transform active:scale-95";
  const normalSize = "flex-1 py-1.5 rounded-xl";
  const centerSize = "flex-[1.2] py-2 px-3 rounded-2xl";

  return (
    <nav
      className="
        fixed bottom-0 inset-x-0 z-40
        md:hidden
        bg-white/95 backdrop-blur
        border-t border-gray-200
      "
      // چیدمان آیکن‌ها LTR، ولی متن‌ها RTL
      style={{ direction: "ltr" }}
    >
      <div className="max-w-md mx-auto px-2 py-1">
        <div className="flex justify-between gap-1">
          {/* چپ‌ترین: نیازمندی‌ها → صفحه آگهی‌ها */}
          <Link
            href="/ads"
            className={`${baseStyle} ${normalSize} ${
              isActive("/ads")
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ListChecks className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] leading-none" dir="rtl">
              نیازمندی‌ها
            </span>
          </Link>

          {/* آگهی‌ها → همون صفحه لیست همه آگهی‌ها */}
          <Link
            href="/ads"
            className={`${baseStyle} ${normalSize} ${
              isActive("/ads")
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Megaphone className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] leading-none" dir="rtl">
              آگهی‌ها
            </span>
          </Link>

          {/* وسط: خانه (بزرگ‌تر) */}
          <Link
            href="/"
            className={`${baseStyle} ${centerSize} ${
              isActive("/")
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Home className="w-6 h-6 mb-0.5" />
            <span className="text-[11px] leading-none" dir="rtl">
              خانه
            </span>
          </Link>

          {/* درج آگهی */}
          <Link
            href="/dashboard/jobads/create"
            className={`${baseStyle} ${normalSize} ${
              isActive("/dashboard/jobads/create")
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <PlusCircle className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] leading-none" dir="rtl">
              درج آگهی
            </span>
          </Link>

          {/* راست‌ترین: پروفایل یا ورود */}
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className={`${baseStyle} ${normalSize} ${
                isActive("/dashboard")
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <User2 className="w-5 h-5 mb-0.5" />
              <span className="text-[11px] leading-none" dir="rtl">
                پروفایل
              </span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => openModal("auth")}
              className={`${baseStyle} ${normalSize} text-gray-600 hover:bg-gray-100`}
            >
              <User2 className="w-5 h-5 mb-0.5" />
              <span className="text-[11px] leading-none" dir="rtl">
                ورود
              </span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
