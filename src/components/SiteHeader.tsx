// src/components/SiteHeader.tsx
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainMenu, MenuItem, MegaMenuSection } from "@/data/menu";
import { useSession, signOut } from "next-auth/react";
import { LogIn, LayoutDashboard, PlusCircle, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/auth/AuthModal";
import type { Session } from "next-auth";

export default function SiteHeader() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  const [authModalOpen, setAuthModalOpen] = useState(false);

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
        <div className="text-2xl font-bold text-gray-900">چاپا</div>

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
          {!isDashboard && status === "authenticated" && (
            <>
              {/* داشبورد */}
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

          {!isDashboard && status === "unauthenticated" && (
            <Button
              variant="ghost"
              className="flex items-center gap-1 text-gray-700 hover:text-black"
              onClick={() => setAuthModalOpen(true)}
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

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
      </div>
    </header>
  );
}
