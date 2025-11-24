"use client";

import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

interface Props {
  role: string;
}

export default function Sidebar({ role }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [items, setItems] = useState<
    { label: string; href?: string; action?: () => void }[]
  >([]);

  useEffect(() => {
    const baseItems = [
      { label: "خانه", href: "/dashboard" },
      { label: "بازگشت", action: () => router.back() },

      // 🔥 خروج اصلاح‌شده
      { label: "خروج", action: () => signOut({ callbackUrl: "https://echap.co/" }) },
    ];

    if (role === "freelancer") {
      baseItems.unshift({ label: "آگهی‌های من", href: "/dashboard/jobs" });
    } else if (role === "supplier") {
      baseItems.unshift({ label: "محصولات من", href: "/dashboard/products" });
    }

    if (["freelancer", "supplier", "user", "admin"].includes(role)) {
      baseItems.unshift({ label: "پروفایل من", href: "/dashboard/profile" });
    }

    setItems(baseItems);
  }, [role, router]);

  return (
    <aside
      className="w-64 min-h-screen bg-gray-100 border-l border-gray-300 p-4 text-right"
      dir="rtl"
    >
      <h2 className="text-lg font-bold mb-4">منو</h2>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index}>
            {item.href ? (
              <button
                onClick={() => router.push(item.href!)}
                className={`w-full text-right px-4 py-2 rounded hover:bg-gray-200 ${
                  pathname === item.href ? "bg-gray-300 font-bold" : ""
                }`}
              >
                {item.label}
              </button>
            ) : (
              <button
                onClick={item.action}
                className="w-full text-right px-4 py-2 rounded hover:bg-gray-200"
              >
                {item.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
