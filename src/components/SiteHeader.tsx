// src/components/SiteHeader.tsx
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainMenu, MenuItem, MegaMenuSection } from "@/data/menu";
import { useSession, signOut } from "next-auth/react";
import { LogIn, LayoutDashboard, PlusCircle, Store, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/auth/AuthModal";
import type { Session } from "next-auth";
import useModalStore from "@/hooks/use-modal-store";

export default function SiteHeader() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  const { openModal } = useModalStore();

  // تبدیل session.user به نوعی که شامل slug و role است
  const user = session?.user as (Session["user"] & {
    slug: string;
    role: string;
  });

  const handleMouseEnter = (title: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(title);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 200);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between relative">
        {/* لوگو / برند */}
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-900 hover:text-black transition"
        >
          {/* آیکون E */}
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 text-white font-black text-lg tracking-tight shadow-sm">
            E
          </span>

          {/* تایپ‌لوگو */}
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-extrabold tracking-[0.25em] uppercase">
              ECHAP
            </span>
            <span className="text-[10px] text-gray-500 hidden sm:block">
              Print &amp; Creative Ecosystem
            </span>
          </div>
        </Link>

        {/* Mega Menu */}
        <nav className="hidden md:flex gap-6 text-sm font-medium absolute left-1/2 -translate-x-1/2">
          {mainMenu.map((item: MenuItem) => (
            <div
              key={item.title}
              className="relative"
              onMouseEnter={() => handleMouseEnter(item.title)}
              onMouseLeave={handleMouseLeave}
            >
              <button className="text-gray-700 hover:text-black transition">
                {item.title}
              </button>
              {item.megaMenu && activeMenu === item.title && (
                <div className="absolute top-full right-0 bg-white border border-gray-200 shadow-xl rounded-xl animate-fadeIn py-4 min-w-[320px] z-50">
                  <div className="px-6 text-right">
                    {item.megaMenu.map((section: MegaMenuSection) => (
                      <div key={section.heading} className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">
                          {section.heading}
                        </h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {section.items.map((sub, i) => (
                            <li key={i}>
                              <Link
                                href={sub.link}
                                className="hover:text-black transition"
                              >
                                {sub.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* لینک فروشگاه‌ها */}
          <Link
            href="/profiles/suppliers"
            className="text-gray-700 hover:text-black transition"
          >
            فروشگاه‌ها
          </Link>
        </nav>

        {/* دکمه‌های سمت راست */}
        <div className="flex gap-2 items-center">
          {/* اگر لاگین شده و در صفحه‌ای غیر از داشبورد هستیم */}
          {!isDashboard && status === "authenticated" && (
            <>
              {/* آیکون خانه → داشبورد */}
              <Link
                href="/dashboard"
                aria-label="رفتن به داشبورد"
                className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 text-gray-700 hover:text-black hover:border-gray-500 transition"
              >
                <Home className="w-4 h-4" />
              </Link>

              {/* داشبورد با متن */}
              <Link
                href="/dashboard"
                className="flex items-center gap-1 border border-gray-300 text-gray-700 hover:text-black px-3 py-1.5 rounded text-sm transition"
              >
                <LayoutDashboard className="w-4 h-4" /> داشبورد
              </Link>

              {/* فروشگاه من (برای supplier) */}
              {user?.role === "supplier" && user.slug && (
                <Link
                  href={`/profiles/suppliers/${user.slug}`}
                  className="flex items-center gap-1 border border-green-500 text-green-600 hover:text-white hover:bg-green-500 px-3 py-1.5 rounded text-sm transition"
                >
                  <Store className="w-4 h-4" /> فروشگاه من
                </Link>
              )}

              {/* خروج */}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-1 border border-red-500 text-red-600 hover:text-white hover:bg-red-500 px-3 py-1.5 rounded text-sm transition"
              >
                خروج
              </button>
            </>
          )}

          {/* وقتی لاگین نیست */}
          {!isDashboard && status === "unauthenticated" && (
            <Button
              variant="ghost"
              className="flex items-center gap-1 text-gray-700 hover:text-black"
              onClick={() => openModal("auth")}
            >
              <LogIn className="w-4 h-4" /> ورود
            </Button>
          )}

          {/* ثبت آگهی */}
          <Link
            href="/dashboard/jobads/create"
            className="flex items-center gap-1 bg-blue-600 text-white hover:bg-blue-700 transition px-4 py-1.5 rounded text-sm"
          >
            <PlusCircle className="w-4 h-4" /> ثبت آگهی
          </Link>
        </div>

        {/* مودال ورود (کنترل‌شده با Zustand) */}
        <AuthModal />
      </div>
    </header>
  );
}
