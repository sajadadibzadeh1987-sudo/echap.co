// src/app/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

import SiteHeader from "@/components/layout/SiteHeader";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import SiteFooter from "@/components/SiteFooter";
import { Toaster } from "react-hot-toast";
import { SessionWrapper } from "@/components/providers/SessionWrapper";
import SessionActivityWatcher from "@/components/auth/SessionActivityWatcher";

// 👇 مهم  
import AuthModal from "@/components/auth/AuthModal";

export const metadata: Metadata = {
  title: "چاپ ها | سامانه خدمات چاپ",
  description: "سامانه جامع چاپ، طراحی، آگهی و خدمات بسته‌بندی",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-yekan antialiased bg-white text-gray-900">
        <SessionWrapper>

          {/* 🟢 مودال ورود با OTP */}
          <AuthModal />

          {/* مانیتور فعالیت کاربر */}
          <SessionActivityWatcher />

          {/* هدر */}
          <SiteHeader />

          {/* محتوای اصلی */}
          <main className="min-h-screen pb-20">{children}</main>

          {/* فوتر دسکتاپ */}
          <SiteFooter />

          {/* ناوبری پایین موبایل */}
          <MobileBottomNav />

          {/* Toastها */}
          <Toaster position="top-center" />

        </SessionWrapper>
      </body>
    </html>
  );
}
