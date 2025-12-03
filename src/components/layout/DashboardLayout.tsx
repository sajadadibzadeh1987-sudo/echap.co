// src/components/layout/DashboardLayout.tsx
"use client";

import { useState, ReactNode } from "react";
import Sidebar from "../dashboard/Sidebar";
import TopBar from "../dashboard/TopBar";
import RoleSelectModal from "@/components/auth/RoleSelectModal";
import { useSession } from "next-auth/react";

interface Props {
  children: ReactNode;
  role: string;
}

export default function DashboardLayout({ children, role }: Props) {
  // فقط برای همگام بودن با session اگر لازم شد
  useSession();

  // کنترل منوی موبایل
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarClosing, setIsSidebarClosing] = useState(false);

  // شروع باز کردن منو
  const handleOpenSidebar = () => {
    setIsSidebarClosing(false);
    setIsSidebarOpen(true);
  };

  // شروع بستن منو (با انیمیشن خروج)
  const startCloseSidebar = () => {
    setIsSidebarClosing(true);
    setTimeout(() => {
      setIsSidebarOpen(false);
      setIsSidebarClosing(false);
    }, 250); // مدت زمان انیمیشن، با CSS هماهنگ باشد
  };

  // دکمه همبرگری: اگر باز است ببند، اگر بسته است باز کن
  const handleToggleSidebar = () => {
    if (isSidebarOpen && !isSidebarClosing) {
      startCloseSidebar();
    } else if (!isSidebarOpen && !isSidebarClosing) {
      handleOpenSidebar();
    }
  };

  const handleBackdropClick = () => {
    if (!isSidebarClosing) startCloseSidebar();
  };

  return (
    <div className="flex min-h-screen bg-gray-100 flex-row-reverse" dir="rtl">
      {/* سایدبار در سمت راست - فقط دسکتاپ */}
      <div className="order-2 hidden lg:block">
        <Sidebar role={role} />
      </div>

      {/* محتوای اصلی در سمت چپ */}
      <div className="flex flex-col flex-1 order-1">
        <TopBar onToggleSidebar={handleToggleSidebar} />

        <main className="p-6 space-y-6">{children}</main>
        {/* مودال انتخاب نقش هنوز هست، اما دیگه خودکار باز نمی‌شود */}
        <RoleSelectModal />
      </div>

      {/* سایدبار موبایل به صورت دراور از سمت راست با انیمیشن رفت و برگشت */}
      {(isSidebarOpen || isSidebarClosing) && (
        <div className="fixed inset-0 z-40 lg:hidden" dir="rtl">
          {/* بک‌دراپ تار با بلور ملایم */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
            onClick={handleBackdropClick}
          />

          {/* پنل منو */}
          <div
            className={`
              absolute inset-y-0 right-0
              w-64 max-w-[80%]
              bg-gray-100
              shadow-xl border-l border-gray-200
              flex flex-col
              ${isSidebarClosing ? "animate-slide-out-rtl" : "animate-slide-in-rtl"}
            `}
          >
            <Sidebar role={role} onClose={startCloseSidebar} />
          </div>
        </div>
      )}
    </div>
  );
}
