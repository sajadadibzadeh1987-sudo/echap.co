// src/components/dashboard/Sidebar.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useCallback, useMemo, useState } from "react";
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

  const handleLogout = useCallback(async () => {
    try {
      await signOut({ redirect: false });
    } finally {
      router.push("/");
    }
  }, [router]);

  const items: MenuItem[] = useMemo(() => {
    if (!session?.user) return [];

    // ✅ نرمال‌سازی نقش برای مقایسه راحت
    const normalizedRole = role?.toLowerCase?.() ?? "user";
    // user, freelancer, supplier, printshop, super_admin, ...

    const base: MenuItem[] = [
      { label: "خانه", href: "/dashboard" },
      { label: "بازگشت", action: () => router.back() },
      { label: "خروج", action: handleLogout },
    ];

    // ⭐ آیتم‌های مشترک برای اکثر نقش‌ها (کاربر عادی، فریلنسر، تأمین‌کننده، چاپخانه، مدیر ارشد)
    if (
      ["user", "freelancer", "supplier", "printshop", "admin", "super_admin"].includes(
        normalizedRole,
      )
    ) {
      base.unshift({ label: "آگهی‌های من", href: "/dashboard/jobads/my" });
      base.unshift({ label: "➕ درج آگهی", href: "/dashboard/jobads/create" });
      base.unshift({ label: "پروفایل من", action: () => setEditOpen(true) });
    }

    // ⭐ محصولات من (برای فریلنسر، تأمین‌کننده، چاپخانه و مدیر ارشد)
    if (
      ["freelancer", "supplier", "printshop", "super_admin"].includes(
        normalizedRole,
      )
    ) {
      base.unshift({ label: "محصولات من", href: "/dashboard/products" });
    }

    // ⭐ پروفایل کسب‌وکار (برای تأمین‌کننده و مدیر ارشد)
    if (["supplier", "super_admin"].includes(normalizedRole)) {
      base.unshift({
        label: "👷‍♂️ پروفایل کسب‌وکار",
        href: "/dashboard/business-profile",
      });
    }

    // ⭐ پروفایل چاپخانه (برای نقش چاپخانه و مدیر ارشد)
    const slug = (session.user as { slug?: string }).slug;
    if (["printshop", "printer", "super_admin"].includes(normalizedRole)) {
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

    // ⭐ منوی مدیریتی مخصوص مدیر ارشد
    if (normalizedRole === "super_admin") {
      base.unshift({
        label: "مدیریت کاربران",
        href: "/dashboard/admin/users",
      });
      base.unshift({
        label: "مدیریت آگهی‌ها",
        href: "/dashboard/admin/ads",
      });
    }

    return base;
  }, [role, session?.user, router, handleLogout]);

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
