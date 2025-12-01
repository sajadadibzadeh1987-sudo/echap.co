// src/components/profile/ProfileEditModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import axios from "axios";
import { toast } from "react-hot-toast";
import DialogWrapper from "@/components/common/DialogWrapper";

// props دریافتی از والد
interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// تایپِ کامل user که شامل firstName، lastName و phone می‌شود
type UserType = {
  id: string;
  role: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
};

export default function ProfileEditModal({
  isOpen,
  onClose,
}: ProfileEditModalProps) {
  const { data: session } = useSession();
  // user را به UserType کست می‌کنیم تا فیلدهای جدید در دسترس باشند
  const user = session?.user as UserType | undefined;

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(user?.image || "/default-avatar.png");
  const [loading, setLoading] = useState(false);

  // هر وقت user تغییر کرد، state فرم را بروزرسانی کن
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setPreviewUrl(user.image || "/default-avatar.png");
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAvatarFile(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await axios.post("/api/profile", formData);

      if (res.data?.success) {
        toast.success("تغییرات ذخیره شد ✅");

        // دوباره signIn می‌کنیم تا session آپدیت شود
        await signIn("credentials", {
          phone: user?.phone ?? "",
          otp: "bypass",
          redirect: false,
        });

        onClose();
      } else {
        toast.error(res.data?.message || "خطا در ذخیره پروفایل ❌");
      }
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      toast.error("خطای غیرمنتظره!");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <DialogWrapper isOpen={isOpen} onClose={onClose} title="ویرایش پروفایل">
      <div className="space-y-4 px-1">
        <div>
          <label className="text-sm font-medium">نام</label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="نام"
          />
        </div>

        <div>
          <label className="text-sm font-medium">نام خانوادگی</label>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="نام خانوادگی"
          />
        </div>

        <div>
          <label className="text-sm font-medium">ایمیل</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="text-sm font-medium">تصویر پروفایل</label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {previewUrl && (
            <div className="mt-2 w-16 h-16 relative rounded-full overflow-hidden">
              <Image
                src={previewUrl}
                alt="پیش‌نمایش پروفایل"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-2"
        >
          {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </Button>
      </div>
    </DialogWrapper>
  );
}
