// src/components/layout/DashboardLayout.tsx
"use client";

import { ReactNode } from "react";
import Sidebar from "../dashboard/Sidebar";
import TopBar from "../dashboard/TopBar";
import RoleSelectModal from "@/components/auth/RoleSelectModal";
import { useSession } from "next-auth/react";

interface Props {
  children: ReactNode;
  role: string;
}

export default function DashboardLayout({ children, role }: Props) {
  // فقط برای همگام بودن با session اگر لازم شد (بدون استفاده مستقیم)
  useSession();

  return (
    <div className="flex min-h-screen bg-gray-100 flex-row-reverse" dir="rtl">
      {/* سایدبار در سمت راست - فقط دسکتاپ */}
      <div className="order-2 hidden lg:block">
        <Sidebar role={role} />
      </div>

      {/* محتوای اصلی در سمت چپ */}
      <div className="flex flex-col flex-1 order-1">
        {/* TopBar الان عملاً null برمی‌گردونه ولی برای سازگاری ساختار نگه داشته شده */}
        <TopBar />

        <main className="p-6 space-y-6">{children}</main>

        {/* مودال انتخاب نقش (از قبل) */}
        <RoleSelectModal />
      </div>
    </div>
  );
}
