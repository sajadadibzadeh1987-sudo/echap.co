'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import UserProfileForm from '@/components/profile/UserProfileForm';

export default function EditProfilePage() {
  const router = useRouter();

  return (
    <div className="p-6 max-w-3xl mx-auto" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">ویرایش پروفایل</h1>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت
        </button>
      </div>
      <UserProfileForm />
    </div>
  );
}
