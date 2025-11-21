"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import UserCard from "@/components/dashboard/UserCard";
import UserDashboard from "@/components/dashboard/UserDashboard";
import FreelancerDashboard from "@/components/dashboard/FreelancerDashboard";
import SupplierDashboard from "@/components/dashboard/SupplierDashboard";
import ProfileEditModal from "@/components/profile/ProfileEditModal";

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

  const role = user?.role || "user";
  const name = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "کاربر";
  const phone = user?.phone || "نامشخص";

  const renderContent = () => {
    if (role === "freelancer") return <FreelancerDashboard />;
    if (role === "supplier") return <SupplierDashboard />;
    return <UserDashboard />;
  };

  return (
    <div className="space-y-8">
      <UserCard onEdit={() => setIsEditOpen(true)} />
      <ProfileEditModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">🎉 خوش آمدی {name}!</h1>
        <p className="text-gray-600 mt-2">نقش شما: {role}</p>
        <p className="text-sm text-gray-500">شماره: {phone}</p>
      </div>

      <div>{renderContent()}</div>
    </div>
  );
}
