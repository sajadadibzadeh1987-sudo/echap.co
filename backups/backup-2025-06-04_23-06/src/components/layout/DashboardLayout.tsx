"use client";

import Sidebar from "../dashboard/Sidebar";
import TopBar from "../dashboard/TopBar";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  role: string;
}

export default function DashboardLayout({ children, role }: Props) {
  return (
    <div className="flex min-h-screen bg-gray-100 flex-row-reverse" dir="rtl">
      {/* سایدبار در سمت راست */}
      <div className="order-2">
        <Sidebar role={role} />
      </div>

      {/* محتوای اصلی در سمت چپ */}
      <div className="flex flex-col flex-1 order-1">
        <TopBar />
        <main className="p-6 space-y-6">{children}</main>
      </div>
    </div>
  );
}
