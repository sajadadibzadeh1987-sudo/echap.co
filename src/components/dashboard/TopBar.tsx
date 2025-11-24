// src/components/dashboard/TopBar.tsx
"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface TopBarProps {
  onToggleSidebar?: () => void;
}

const TopBar = ({ onToggleSidebar }: TopBarProps) => {
  const { data: session } = useSession();
  const router = useRouter();

  const user = session?.user as {
    id: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    image?: string;
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
    } finally {
      router.push("/");
    }
  };

  return (
    <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border bg-background">
      {/* سمت راست (در RTL): دکمه منو + نام کاربر */}
      <div className="flex items-center gap-3">
        {/* دکمه منوی همبرگری - فقط موبایل */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex items-center justify-center rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 lg:hidden"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="text-sm font-medium">
          {user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.phone
            ? `شماره: ${user.phone}`
            : "کاربر وارد شده"}
        </div>
      </div>

      {/* سمت چپ: دکمه خروج */}
      <div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="gap-2 text-sm"
        >
          <LogOut className="w-4 h-4" />
          خروج
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
