import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Toaster } from "react-hot-toast"; // 🔄 جایگزین sonner
import { SessionWrapper } from "@/components/providers/SessionWrapper";

export const metadata: Metadata = {
  title: "چاپ ها | سامانه خدمات چاپ",
  description: "سامانه جامع چاپ، طراحی، آگهی و خدمات بسته‌بندی",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-yekan antialiased bg-white text-gray-900">
        <SessionWrapper>
          <SiteHeader />
          <main className="min-h-screen">{children}</main>
          <SiteFooter />
          <Toaster position="top-center" /> {/* ✅ فعال‌سازی toast */}
        </SessionWrapper>
      </body>
    </html>
  );
}
