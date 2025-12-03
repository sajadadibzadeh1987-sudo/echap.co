"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import UserCard from "@/components/dashboard/UserCard";
import UserDashboard from "@/components/dashboard/UserDashboard";
import FreelancerDashboard from "@/components/dashboard/FreelancerDashboard";
import SupplierDashboard from "@/components/dashboard/SupplierDashboard";
import ProfileEditModal from "@/components/profile/ProfileEditModal";
import CoinsSummary from "@/components/dashboard/CoinsSummary";
import SuperAdminDashboard from "@/components/dashboard/SuperAdminDashboard";

export default function ClientDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.id) {
      console.log("🔴 کاربر لاگین نیست. ریدایرکت به صفحه اصلی");
      router.push("/");
    }
  }, [session, status, router]);

  // ✅ تایپ کامل و دقیق برای جلوگیری از ارور TypeScript
  const user = session?.user as {
    id: string;
    role: string;
    phone?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    image?: string | null;
    email?: string | null;
    hasSelectedRole?: boolean;
  };

  const rawRole = user?.role || "USER";
  const normalizedRole = rawRole.toUpperCase(); // USER / FREELANCER / SUPPLIER / PRINTSHOP / SUPER_ADMIN

  const name =
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "کاربر";
  const phone = user?.phone || "نامشخص";

  const readableRole =
    normalizedRole === "SUPER_ADMIN"
      ? "مدیر ارشد"
      : normalizedRole === "FREELANCER"
      ? "فریلنسر"
      : normalizedRole === "SUPPLIER"
      ? "تأمین‌کننده"
      : normalizedRole === "PRINTSHOP"
      ? "چاپخانه"
      : "کاربر";

  const renderContent = () => {
    if (normalizedRole === "SUPER_ADMIN") return <SuperAdminDashboard />;
    if (normalizedRole === "FREELANCER") return <FreelancerDashboard />;
    if (normalizedRole === "SUPPLIER") return <SupplierDashboard />;
    // PRINTSHOP فعلاً می‌تونه از UserDashboard استفاده کند تا فرم تخصصی بسازیم
    return <UserDashboard />;
  };

  return (
    <div className="space-y-8">
      {/* کارت پروفایل و مودال ویرایش */}
      <UserCard onEdit={() => setIsEditOpen(true)} />
      <ProfileEditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />

      {/* خوش‌آمدگویی */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">
          🎉 خوش آمدی {name}!
        </h1>
        <p className="text-gray-600 mt-2">نقش شما: {readableRole}</p>
        <p className="text-sm text-gray-500">شماره: {phone}</p>
      </div>

      {/* سکه‌ها برای همه نقش‌ها (حتی سوپر ادمین) */}
      <CoinsSummary />

      {/* محتوای اصلی داشبورد بر اساس نقش */}
      <div>{renderContent()}</div>
    </div>
  );
}
