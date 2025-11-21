"use client";

import { useEffect, useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import TopBar from "../dashboard/TopBar";
import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import useModalStore from "@/hooks/use-modal-store";
import RoleSelectModal from "@/components/auth/RoleSelectModal";

interface Props {
  children: ReactNode;
  role: string;
}

export default function DashboardLayout({ children, role }: Props) {
  const { data: session } = useSession();
  const { openModal } = useModalStore();
  const [hasCheckedRole, setHasCheckedRole] = useState(false);

  useEffect(() => {
    if (!hasCheckedRole && session?.user?.role === "user") {
      openModal("selectRole");
      setHasCheckedRole(true);
    }
  }, [session, hasCheckedRole, openModal]);

  return (
    <div className="flex min-h-screen bg-gray-100 flex-row-reverse" dir="rtl">
      {/* سایدبار در سمت راست */}
      <div className="order-2">
        <Sidebar role={role} />
      </div>

      {/* محتوای اصلی در سمت چپ */}
      <div className="flex flex-col flex-1 order-1">
        <TopBar />
        <main className="p-6 space-y-6">{children}</main>
        <RoleSelectModal />
      </div>
    </div>
  );
}
