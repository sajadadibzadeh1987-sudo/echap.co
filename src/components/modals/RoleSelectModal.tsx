"use client";

import { useSession } from "next-auth/react";
import useModalStore from "@/hooks/use-modal-store";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import DialogWrapper from "@/components/common/DialogWrapper";
import Image from "next/image";

const roles = [
  {
    key: "user",
    label: "کاربر عمومی",
    image: "/roles/user.png",
  },
  {
    key: "freelancer",
    label: "فریلنسر",
    image: "/roles/freelancer.png",
  },
  {
    key: "supplier",
    label: "تأمین‌کننده",
    image: "/roles/supplier.png",
  },
  {
    key: "printer",
    label: "چاپخانه",
    image: "/roles/printer.png",
  },
];

export default function RoleSelectModal() {
  const { isOpen, type, closeModal } = useModalStore();
  const { data: session, update } = useSession();
  const userId = session?.user?.id;
  const [loading, setLoading] = useState(false);

  const handleSelect = async (role: string) => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await axios.post("/api/update-role", { userId, role });
      if (res.data.success) {
        toast.success("✅ نقش با موفقیت ثبت شد");
        await update();
        closeModal();
      } else {
        toast.error("❌ تغییر نقش ناموفق بود");
      }
    } catch {
      toast.error("❌ خطای ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  if (type !== "selectRole") return null;

  return (
    <DialogWrapper isOpen={isOpen} onClose={closeModal} title="انتخاب نقش">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4">
        {roles.map((role) => (
          <div
            key={role.key}
            onClick={() => handleSelect(role.key)}
            className={cn(
              "cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white rounded-lg p-3 border border-gray-200 flex flex-col items-center",
              loading && "opacity-50 pointer-events-none"
            )}
          >
            <div className="relative w-20 h-20">
              <Image
                src={role.image}
                alt={role.label}
                fill
                className="object-contain"
              />
            </div>
            <p className="mt-3 text-sm font-semibold text-gray-700 hover:text-black">
              {role.label}
            </p>
          </div>
        ))}
      </div>
    </DialogWrapper>
  );
}
