// src/app/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

// هدر جدید (دسکتاپ + موبایل)
import SiteHeader from "@/components/layout/SiteHeader";
// نوار پایینی موبایل شبیه دیجی‌کالا
import MobileBottomNav from "@/components/layout/MobileBottomNav";

// فوتر قدیمی
import SiteFooter from "@/components/SiteFooter";

import { Toaster } from "react-hot-toast";
import { SessionWrapper } from "@/components/providers/SessionWrapper";

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
          {/* هدر */}
          <SiteHeader />

          {/* محتوای اصلی – فضای پایین برای نوار موبایل در نظر گرفته شده */}
          <main className="min-h-screen pb-20">{children}</main>

          {/* فوتر دسکتاپ */}
          <SiteFooter />

          {/* نوار ناوبری پایین فقط در موبایل */}
          <MobileBottomNav />

          {/* Toastها */}
          <Toaster position="top-center" />
        </SessionWrapper>
      </body>
    </html>
  );
}
