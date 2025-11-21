"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Props {
  onEdit?: () => void; // تابع اختیاری برای باز کردن پاپ‌آپ
}

export default function UserCard({ onEdit }: Props) {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) return null;

  const hasProfile =
    user.firstName?.trim() && user.lastName?.trim();

  return (
    <div
      className="w-full max-w-xl bg-white shadow-md rounded-xl p-6 mx-auto text-right space-y-4"
      dir="rtl"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <div className="relative w-28 h-28 rounded-full overflow-hidden border border-gray-300">
          <Image
            src={user.image || "/default-avatar.png"}
            alt="آواتار"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 space-y-1">
          <h2 className="text-xl font-bold text-gray-800">
            {user.firstName || "بدون نام"} {user.lastName || ""}
          </h2>
          {user.email && <p className="text-sm text-gray-600">📧 {user.email}</p>}
          {user.phone && <p className="text-sm text-gray-600">📱 {user.phone}</p>}
          {user.role && <p className="text-sm text-gray-500 italic">نقش: {user.role}</p>}
        </div>
      </div>

      <div className="text-left sm:text-right">
        <Button variant="outline" onClick={onEdit}>
          {hasProfile ? "✏️ ویرایش پروفایل" : "🟠 تکمیل پروفایل"}
        </Button>
      </div>
    </div>
  );
}
