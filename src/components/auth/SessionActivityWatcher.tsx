// src/components/auth/SessionActivityWatcher.tsx
"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const INACTIVITY_LIMIT_MS = 10 * 60 * 1000; // 10 دقیقه

export default function SessionActivityWatcher() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        try {
          await signOut({ redirect: false });
        } finally {
          router.push("/"); // بعد از خروج به صفحه اصلی برو
        }
      }, INACTIVITY_LIMIT_MS);
    };

    // شروع اولیه تایمر
    resetTimer();

    const events: (keyof WindowEventMap)[] = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart",
    ];

    events.forEach((event) => window.addEventListener(event, resetTimer));

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, [status, router]);

  return null; // چیزی رندر نمی‌کنیم
}
