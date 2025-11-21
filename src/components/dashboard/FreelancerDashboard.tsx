"use client";

import { useSession } from "next-auth/react";

export default function FreelancerDashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div>در حال بارگذاری...</div>;
  if (!session?.user) return <div>دسترسی غیرمجاز. لطفاً وارد شوید.</div>;

  const role = session.user.role;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">📂 داشبورد فریلنسر</h2>
      <p>نقش شما: {role}</p>
      {/* سایر محتوای فریلنسر اینجا بیاد */}
    </div>
  );
}
