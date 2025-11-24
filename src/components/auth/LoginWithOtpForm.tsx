// src/components/auth/LoginWithOtpForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

// ⚠️ هوک پاپ‌آپ مادر – به صورت default import
import useModalStore from "@/hooks/use-modal-store";

// Toast ساده
import { toast } from "react-hot-toast";

export default function LoginWithOtpForm() {
  const router = useRouter();

  // 👇 برای اینکه خطای onClose نده، موقتاً as any می‌کنیم
  const modal = useModalStore() as any;

  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"phone" | "verify">("phone");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // ====== تایمر ۲ دقیقه‌ای ======
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  // ====== ارسال کد ======
  const handleSendCode = async () => {
    if (!phone.trim()) {
      toast.error("شماره را وارد کنید");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/send-otp", { phone });
      toast.success("کد تایید ارسال شد");

      setStep("verify");
      setTimeLeft(120); // شروع تایمر ۲ دقیقه‌ای
    } catch {
      toast.error("خطا در ارسال کد تایید");
    } finally {
      setLoading(false);
    }
  };

  // ====== تایید کد ======
  const handleVerify = async () => {
    if (!otp.trim()) {
      toast.error("کد تایید را وارد کنید");
      return;
    }

    setLoading(true);

    const res = await signIn("credentials", {
      phone,
      otp,
      redirect: false,
    });

    setLoading(false);

    if (res?.ok) {
      toast.success("ورود با موفقیت انجام شد");

      // بستن اتومات پاپ‌آپ + رفتن به داشبورد
      setTimeout(() => {
        if (modal?.onClose) modal.onClose();
        router.push("/dashboard");
      }, 600);
    } else {
      toast.error("کد تایید اشتباه یا منقضی شده");
    }
  };

  return (
    <div className="space-y-4">
      {step === "phone" && (
        <>
          <Input
            type="tel"
            placeholder="شماره موبایل"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Button
            onClick={handleSendCode}
            disabled={loading}
            className="w-full"
          >
            {loading ? "در حال ارسال..." : "ارسال کد تایید"}
          </Button>
        </>
      )}

      {step === "verify" && (
        <>
          <Input
            type="text"
            placeholder="کد تایید"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          {/* تایمر مثل اپ‌های بانکی */}
          <div className="text-center text-sm text-gray-600">
            {timeLeft > 0 ? (
              <>زمان باقی‌مانده: {formatTime(timeLeft)}</>
            ) : (
              <span className="text-red-500">
                کد منقضی شد • لطفاً دوباره ارسال کنید
              </span>
            )}
          </div>

          <Button
            onClick={handleVerify}
            disabled={loading || timeLeft <= 0}
            className="w-full"
          >
            {loading ? "در حال ورود..." : "تایید و ورود"}
          </Button>

          {timeLeft <= 0 && (
            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={handleSendCode}
            >
              ارسال مجدد کد
            </Button>
          )}
        </>
      )}
    </div>
  );
}
