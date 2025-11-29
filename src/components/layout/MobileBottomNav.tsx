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

  const items = [
    { labelFa: "نیازمندی‌ها", href: "/as", icon: ListChecks, key: "needs" },
    { labelFa: "آگهی‌ها", href: "/ads", icon: Megaphone, key: "ads" },
    { labelFa: "خانه", href: "/", icon: Home, key: "home" },
    {
      labelFa: "درج آگهی",
      href: "/dashboard/jobads/create",
      icon: PlusCircle,
      key: "create",
    },
  ] as const;

  return (
    <nav
      className="
        fixed bottom-0 inset-x-0 z-40
        md:hidden
        bg-black/70          /* شیشه دودی با اوپَسیتی */
        backdrop-blur-md     /* بلور پس‌زمینه */
      "
      // آیکون‌ها LTR، تکست‌ها RTL
      style={{ direction: "ltr" }}
    >
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-3">
          {/* چهار آیتم اصلی */}
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.key}
                href={item.href}
                className="flex-1 flex justify-center"
              >
                <div
                  className={[
                    "flex items-center justify-center gap-1",
                    "transition-all duration-200 ease-out active:scale-95",
                    active
                      ? "px-3 py-2 rounded-full bg-[#111827] text-white shadow-[0_0_14px_rgba(255,255,255,0.45)]"
                      : "w-12 h-12 rounded-full text-gray-400",
                  ].join(" ")}
                >
                  <Icon className="w-[22px] h-[22px]" strokeWidth={2} />
                  {active && (
                    <span
                      className="text-[12px] font-medium leading-none"
                      dir="rtl"
                    >
                      {item.labelFa}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}

          {/* پروفایل / ورود (آیتم پنجم سمت راست) */}
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="flex-1 flex justify-center"
            >
              <div
                className={[
                  "flex items-center justify-center gap-1",
                  "transition-all duration-200 ease-out active:scale-95",
                  isActive("/dashboard")
                    ? "px-3 py-2 rounded-full bg-[#111827] text-white shadow-[0_0_14px_rgba(255,255,255,0.45)]"
                    : "w-12 h-12 rounded-full text-gray-400",
                ].join(" ")}
              >
                <User2 className="w-[22px] h-[22px]" strokeWidth={2} />
                {isActive("/dashboard") && (
                  <span
                    className="text-[12px] font-medium leading-none"
                    dir="rtl"
                  >
                    پروفایل
                  </span>
                )}
              </div>
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => openModal("auth")}
              className="flex-1 flex justify-center"
            >
              <div
                className="
                  w-12 h-12 rounded-full
                  flex items-center justify-center
                  text-gray-400
                  transition-all duration-200 ease-out active:scale-95
                "
              >
                <User2 className="w-[22px] h-[22px]" strokeWidth={2} />
              </div>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
