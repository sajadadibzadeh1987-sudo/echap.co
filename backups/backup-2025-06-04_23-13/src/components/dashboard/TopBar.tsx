"use client";

import { Bell, Mail, User } from "lucide-react";
import Image from "next/image";

export default function TopBar() {
  return (
    <header className="bg-white shadow px-6 py-4 flex items-center justify-between border-b">
      <h1 className="text-lg font-bold">داشبورد</h1>
      <div className="flex items-center gap-6">
        <button className="relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="relative">
          <Mail className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -left-1 w-2 h-2 bg-green-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2">
          <Image
            src="/default-avatar.png"
            alt="کاربر"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="text-sm font-semibold text-gray-700">آنلاین</span>
        </div>
      </div>
    </header>
  );
}
