// src/components/dashboard/TopBar.tsx
"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const TopBar = () => {
  const { data: session } = useSession();

  // کست کردن user به تایپ کامل‌تری که خودت نیاز داری
  const user = session?.user as {
    id: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    image?: string;
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-background">
      <div className="text-sm font-medium">
        {user?.firstName && user?.lastName
          ? `${user.firstName} ${user.lastName}`
          : user?.phone
          ? `شماره: ${user.phone}`
          : "کاربر وارد شده"}
      </div>
      <div>
        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: "https://echap.co/" })} // ✅ اصلاح شد
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
