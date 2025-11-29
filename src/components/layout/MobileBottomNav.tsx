// src/components/layout/MobileBottomNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  User2,
  PlusCircle,
  Megaphone,
  ListChecks,
} from "lucide-react";
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

  const items = [
    { key: "needs", labelFa: "فروشگاه", href: "/as", icon: ListChecks },
    { key: "ads", labelFa: "آگهی‌ها", href: "/ads", icon: Megaphone },
    { key: "home", labelFa: "خانه", href: "/", icon: Home },
    {
      key: "create",
      labelFa: "درج آگهی",
      href: "/dashboard/jobads/create",
      icon: PlusCircle,
    },
  ] as const;

  return (
    <nav
      className="
        fixed bottom-0 inset-x-0 z-50
        md:hidden
        bg-white
        border-t border-gray-200
      "
      style={{ direction: "ltr" }}
    >
      <div className="w-full">
        <div className="flex items-center justify-between h-16 w-full">
          {/* ۴ آیتم اصلی */}
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.key}
                href={item.href}
                className="flex-1 h-full flex items-center justify-center"
              >
                <div className="flex flex-col items-center gap-1">
                  <Icon
                    className={`w-[22px] h-[22px] ${
                      active ? "text-red-500" : "text-gray-400"
                    }`}
                    strokeWidth={2}
                  />
                  <span
                    className={`text-[11px] leading-none ${
                      active ? "text-red-500" : "text-gray-500"
                    }`}
                    dir="rtl"
                  >
                    {item.labelFa}
                  </span>
                </div>
              </Link>
            );
          })}

          {/* پروفایل یا ورود */}
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="flex-1 h-full flex items-center justify-center"
            >
              <div className="flex flex-col items-center gap-1">
                <User2
                  className={`w-[22px] h-[22px] ${
                    isActive("/dashboard")
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                  strokeWidth={2}
                />
                <span
                  className={`text-[11px] leading-none ${
                    isActive("/dashboard")
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                  dir="rtl"
                >
                  پروفایل
                </span>
              </div>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => openModal("auth")}
              className="flex-1 h-full flex items-center justify-center"
            >
              <div className="flex flex-col items-center gap-1">
                <User2
                  className="w-[22px] h-[22px] text-gray-400"
                  strokeWidth={2}
                />
                <span className="text-[11px] leading-none text-gray-500" dir="rtl">
                  ورود
                </span>
              </div>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
