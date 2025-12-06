// src/components/layout/MobileBottomNav.tsx
"use client";

import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  User2,
  PlusCircle,
  Megaphone,
  MessageCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";

import useModalStore from "@/hooks/use-modal-store";
import { useProfilePanelStore } from "@/store/useProfilePanelStore";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

interface NavItem {
  key: "profile" | "create" | "home" | "ads" | "chat";
  labelFa: string;
  href: string;
  icon: IconComponent;
  requireAuth?: boolean;
}

interface AuthModalStore {
  openModal: (type: string, data?: unknown) => void;
}

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;

  const { openModal } = useModalStore() as unknown as AuthModalStore;
  const { open: openProfilePanel } = useProfilePanelStore();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const items: NavItem[] = [
    // پروفایل
    {
      key: "profile",
      labelFa: isLoggedIn ? "پروفایل" : "ورود",
      href: "/dashboard",
      icon: User2,
      requireAuth: true,
    },
    // درج آگهی
    {
      key: "create",
      labelFa: "درج آگهی",
      href: "/dashboard/jobads/create",
      icon: PlusCircle,
      requireAuth: true,
    },
    // خانه
    {
      key: "home",
      labelFa: "خانه",
      href: "/",
      icon: Home,
    },
    // آگهی‌ها
    {
      key: "ads",
      labelFa: "آگهی‌ها",
      href: "/ads",
      icon: Megaphone,
    },
    // چت
    {
      key: "chat",
      labelFa: "چت",
      href: "/dashboard/chat",
      icon: MessageCircle,
      requireAuth: true,
    },
  ];

  const handleProtectedClick = (item: NavItem) => {
    const { href, requireAuth, key } = item;

    // اگر نیاز به لاگین دارد و لاگین نیست
    if (requireAuth && !isLoggedIn) {
      openModal("auth");
      return;
    }

    // آیتم پروفایل: اگر لاگین است، پنل پروفایل مثل «دیوار من» باز شود
    if (key === "profile" && isLoggedIn) {
      openProfilePanel();
      return;
    }

    // سایر آیتم‌ها: ناوبری عادی
    router.push(href);
  };

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
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            // آیتم‌هایی که نیاز به احراز هویت دارند
            if (item.requireAuth) {
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleProtectedClick(item)}
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
                </button>
              );
            }

            // آیتم‌های بدون نیاز به لاگین
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
        </div>
      </div>
    </nav>
  );
}
