// src/components/dashboard/Sidebar.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import ProfileEditModal from "@/components/profile/ProfileEditModal";

interface MenuItem {
  label: string;
  href?: string;
  action?: () => void | Promise<void>;
}

interface Props {
  role: string;
  onClose?: () => void; // برای دکمه ✕ در موبایل
}

export default function Sidebar({ role, onClose }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [editOpen, setEditOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
    } finally {
      router.push("/");
    }
  };

  const items: MenuItem[] = useMemo(() => {
    if (!session?.user) return [];

    const base: MenuItem[] = [
      { label: "خانه", href: "/dashboard" },
      { label: "بازگشت", action: () => router.back() },
      { label: "خروج", action: handleLogout },
    ];

    if (role === "supplier") {
      base.unshift({
        label: "👷‍♂️ پروفایل کسب‌وکار",
        href: "/dashboard/business-profile",
      });
    }

    if (["freelancer", "supplier"].includes(role)) {
      base.unshift({ label: "محصولات من", href: "/dashboard/products" });
    }

    if (["freelancer", "supplier", "user", "admin"].includes(role)) {
      base.unshift({ label: "آگهی‌های من", href: "/dashboard/jobads/my" });
      base.unshift({ label: "➕ درج آگهی", href: "/dashboard/jobads/create" });
      base.unshift({ label: "پروفایل من", action: () => setEditOpen(true) });
    }

    const slug = (session.user as { slug?: string }).slug;
    if (role === "printer") {
      base.unshift({
        label: "🛠 ایجاد / ویرایش پروفایل چاپخانه",
        href: "/dashboard/printer-profile",
      });

      if (slug) {
        base.unshift({
          label: "👁 مشاهده پروفایل من",
          href: `/profiles/printer/${slug}`,
        });
      }
    }

    return base;
  }, [role, session?.user, router]);

  return (
    <aside
      className="
        w-full              /* موبایل: پهنای کامل پنل */
        lg:w-64             /* دسکتاپ: عرض ثابت */
        lg:min-h-screen
        bg-gray-100
        border-l border-gray-300
        p-4
        text-right
      "
      dir="rtl"
    >
      {/* عنوان منو + دکمه ✕ (فقط اگر onClose تعریف شده باشد) */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">منو</h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="
              w-8 h-8
              flex items-center justify-center
              rounded-full
              text-gray-500
              hover:bg-gray-200
              active:bg-gray-300
              transition
            "
            aria-label="بستن منو"
          >
            ✕
          </button>
        )}
      </div>

      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx}>
            {item.href ? (
              <button
                onClick={() => {
                  router.push(item.href!);
                  onClose?.(); // در موبایل بعد از انتخاب آیتم منو بسته شود
                }}
                className={`w-full text-right px-4 py-2 rounded hover:bg-gray-200 ${
                  pathname === item.href ? "bg-gray-300 font-bold" : ""
                }`}
              >
                {item.label}
              </button>
            ) : (
              <button
                onClick={async () => {
                  await item.action?.();
                  onClose?.();
                }}
                className="w-full text-right px-4 py-2 rounded hover:bg-gray-200"
              >
                {item.label}
              </button>
            )}
          </li>
        ))}
      </ul>

      <ProfileEditModal isOpen={editOpen} onClose={() => setEditOpen(false)} />
    </aside>
  );
}
