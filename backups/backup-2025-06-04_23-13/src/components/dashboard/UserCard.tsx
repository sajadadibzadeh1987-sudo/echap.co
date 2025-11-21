"use client";

import useSWR from "swr";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function UserCard() {
  const { data: user, isLoading, error } = useSWR("/api/me", fetcher);
  const router = useRouter();

  if (isLoading) return <p className="text-center">در حال بارگذاری...</p>;
  if (error || !user) return <p className="text-center text-red-500">خطا در دریافت اطلاعات</p>;

  return (
    <div
      className="w-full max-w-xl bg-white shadow-md rounded-xl p-6 mx-auto text-right space-y-4"
      dir="rtl"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <div className="relative w-28 h-28 rounded-full overflow-hidden border border-gray-300">
          <Image
            src={user.avatar || "/default-avatar.png"}
            alt="آواتار"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-800 mb-1">{user.name || "بدون نام"}</h2>
          <p className="text-sm text-gray-600 mb-1">ایمیل: {user.email}</p>
          {user.phone && <p className="text-sm text-gray-600 mb-1">شماره: {user.phone}</p>}
          {user.bio && <p className="text-sm text-gray-600">بیوگرافی: {user.bio}</p>}
        </div>
      </div>

      {/* دکمه ویرایش پروفایل */}
      <div className="text-left sm:text-right">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/profile/edit")}
        >
          ✏️ ویرایش پروفایل
        </Button>
      </div>
    </div>
  );
}
