"use client";

import { useSession, signIn } from "next-auth/react";
import useModalStore from "@/hooks/use-modal-store";
import { toast } from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import DialogWrapper from "@/components/common/DialogWrapper";
import Image from "next/image";

const roles = [
  { key: "user", label: "کاربر عمومی", image: "/roles/user.png" },
  { key: "freelancer", label: "فریلنسر", image: "/roles/freelancer.png" },
  { key: "supplier", label: "تأمین‌کننده", image: "/roles/supplier.png" },
  { key: "printer", label: "چاپخانه", image: "/roles/printer.png" },
];

export default function RoleSelectModal() {
  const { isOpen, type, closeModal } = useModalStore();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const user = session?.user as {
    id: string;
    role: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    image?: string;
    email?: string;
    hasSelectedRole?: boolean;
  };

  const userId = user?.id;
  const phone = user?.phone;

  const handleSelect = async (role: string) => {
    if (!userId || !phone) return;
    setLoading(true);
    try {
      const res = await axios.post("/api/update-role", { userId, role });
      if (res.data.success) {
        toast.success("✅ نقش با موفقیت ثبت شد");

        await signIn("credentials", {
          phone,
          otp: "bypass",
          redirect: false,
        });

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
    <DialogWrapper isOpen={isOpen} onClose={closeModal} title="انتخاب نقش شما">
      <div className="grid grid-cols-2 gap-4 mt-4">
        {roles.map((role) => (
          <button
            key={role.key}
            onClick={() => handleSelect(role.key)}
            className="relative group border rounded-lg p-4 hover:shadow-lg hover:border-blue-500 transition transform hover:scale-105"
            disabled={loading}
          >
            <Image
              src={role.image}
              alt={role.label}
              width={100}
              height={100}
              className="mx-auto mb-2"
            />
            <p className="text-center font-semibold text-gray-700 group-hover:text-blue-600">
              {role.label}
            </p>
          </button>
        ))}
      </div>
    </DialogWrapper>
  );
}
