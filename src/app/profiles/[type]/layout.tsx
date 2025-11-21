// مسیر: src/app/profiles/[type]/layout.tsx

import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  params: { type: string };
}

const titles: Record<string, string> = {
  suppliers: "تأمین‌کنندگان",
  freelancers: "فریلنسرها",
  printers: "چاپخانه‌ها",
};

export default function ProfilesLayout({ children, params }: Props) {
  const { type } = params;
  const title = titles[type] || "فروشگاه‌ها";

  return (
    <div className="container mx-auto py-8">
      {/* تیتر صفحه */}
      <h1 className="text-3xl font-bold mb-4">{title}</h1>

      {/* نوبری بین انواع پروفایل */}
      <nav className="mb-6 space-x-4 text-blue-600">
        <Link href="/profiles/suppliers">تأمین‌کنندگان</Link>
        <Link href="/profiles/freelancers">فریلنسرها</Link>
        <Link href="/profiles/printers">چاپخانه‌ها</Link>
      </nav>

      {/* اینجا محتویات لیست یا جزئیات قرار می‌گیرد */}
      <div>{children}</div>
    </div>
  );
}
