// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";

import "./globals.css";

import SiteHeader from "@/components/layout/SiteHeader";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import SiteFooter from "@/components/SiteFooter";
import { Toaster } from "react-hot-toast";
import { SessionWrapper } from "@/components/providers/SessionWrapper";
import SessionActivityWatcher from "@/components/auth/SessionActivityWatcher";

// 🟢 مودال ورود با OTP
import AuthModal from "@/components/auth/AuthModal";

// ==========================
// 🔒 جلوگیری کامل از زوم در موبایل
// ==========================
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// ==========================
// 🔵 Metadata
// ==========================
export const metadata: Metadata = {
  title: "ایچاپ | سامانه خدمات چاپ",
  description: "ایچاپ – سامانه جامع چاپ، طراحی، آگهی و خدمات بسته‌بندی",
};

// ==========================
// 🔵 Layout
// ==========================
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-yekan antialiased bg-white text-gray-900">
        <SessionWrapper>
          {/* 🔵 مودال ورود با OTP */}
          <AuthModal />

          {/* 🔵 مانیتور تمام فعالیت‌ها */}
          <SessionActivityWatcher />

          {/* 🔵 هدر داخل Suspense */}
          <Suspense fallback={null}>
            <SiteHeader />
          </Suspense>

          {/* 🔵 محتوای اصلی */}
          <main className="min-h-screen pb-20">{children}</main>

          {/* 🔵 فوتر دسکتاپ */}
          <SiteFooter />

          {/* 🔵 ناوبری موبایل */}
          <MobileBottomNav />

          {/* 🔵 Toast */}
          <Toaster position="top-center" />
        </SessionWrapper>
      </body>
    </html>
  );
}
