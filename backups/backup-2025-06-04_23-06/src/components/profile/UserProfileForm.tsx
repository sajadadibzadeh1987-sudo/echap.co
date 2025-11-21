"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((user) => {
        setData(user);
        if (user.avatar) setPreviewUrl(user.avatar);
      })
      .catch((err) => console.error("خطا در دریافت اطلاعات:", err));
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone", data.phone || "");
    formData.append("bio", data.bio || "");
    if (avatarFile) formData.append("avatar", avatarFile);

    const res = await fetch("/api/profile", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("✅ پروفایل با موفقیت ذخیره شد");
    } else {
      alert("❌ خطا در ذخیره پروفایل");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-md p-6 w-full max-w-xl mx-auto mt-10 border border-gray-200"
      dir="rtl"
    >
      <div className="mb-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-blue-600 hover:underline"
        >
          ← بازگشت
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-right text-gray-800">ویرایش پروفایل</h2>

      <div className="mb-4 text-right">
        <label className="block text-sm mb-1 text-gray-700">نام</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg p-2"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
      </div>

      <div className="mb-4 text-right">
        <label className="block text-sm mb-1 text-gray-700">ایمیل</label>
        <input
          type="email"
          className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 cursor-not-allowed"
          value={data.email}
          readOnly
        />
      </div>

      <div className="mb-4 text-right">
        <label className="block text-sm mb-1 text-gray-700">شماره تماس</label>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-lg p-2"
          value={data.phone}
          onChange={(e) => setData({ ...data, phone: e.target.value })}
        />
      </div>

      <div className="mb-4 text-right">
        <label className="block text-sm mb-1 text-gray-700">بیوگرافی</label>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-2 h-24 resize-none"
          value={data.bio}
          onChange={(e) => setData({ ...data, bio: e.target.value })}
        ></textarea>
      </div>

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
              layout="fill"
              objectFit="cover"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold py-2 rounded-lg transition"
      >
        ذخیره تغییرات
      </button>
    </form>
  );
}
