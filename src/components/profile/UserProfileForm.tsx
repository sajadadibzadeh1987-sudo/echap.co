// src/components/profile/UserProfileForm.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

interface UserData {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
}

export default function UserProfileForm() {
  const router = useRouter();

  const [data, setData] = useState<UserData>({
    name: "",
    email: "",
    phone: "",
    bio: "",
    avatar: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // بارگذاری اولیه‌ی اطلاعات کاربر — فقط یک‌بار روی mount
  useEffect(() => {
    let mounted = true;
    async function loadUser() {
      try {
        const res = await fetch("/api/me");
        if (!mounted) return;
        const user: UserData = await res.json();
        setData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          bio: user.bio || "",
          avatar: user.avatar || "",
        });
        setPreviewUrl(user.avatar || null);
      } catch (err) {
        console.error("خطا در دریافت اطلاعات:", err);
        toast.error("❌ خطا در دریافت اطلاعات کاربر");
      }
    }
    loadUser();
    return () => {
      mounted = false;
    };
  }, []); // ← مهم: آرایه وابستگی خالی

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // جدا کردن first/last name
      const [firstName = "", ...rest] = data.name.trim().split(" ");
      const lastName = rest.join(" ");

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("phone", data.phone ?? "");
      formData.append("bio", data.bio ?? "");
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await fetch("/api/profile", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Status " + res.status);
      toast.success("✅ پروفایل با موفقیت ذخیره شد");

      // اگر می‌خواهید داده‌ی نمایش داده‌شده را تازه کنید:
      router.refresh(); 
      // یا: router.push(router.pathname);

    } catch (err) {
      console.error("خطا در ذخیره پروفایل:", err);
      toast.error("❌ خطا در ذخیره پروفایل");
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-md p-6 w-full max-w-xl mx-auto mt-10 border border-gray-200"
      dir="rtl"
    >
      {/* ... بقیه فیلدها دقیقاً مثل قبل ... */}

      <div className="mb-6 text-right">
        <label className="block text-sm mb-1 text-gray-700">تصویر پروفایل</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="block w-full text-sm text-gray-500"
        />
        {previewUrl && (
          <div className="mt-4 w-24 h-24 relative rounded-full overflow-hidden border mx-auto">
            <Image
              src={previewUrl}
              alt="پیش‌نمایش"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold py-2 rounded-lg transition"
      >
        {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
      </button>
    </form>
  );
}
