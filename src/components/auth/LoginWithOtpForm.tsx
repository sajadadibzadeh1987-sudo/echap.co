// src/components/auth/LoginWithOtpForm.tsx
"use client";

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useModalStore from "@/hooks/use-modal-store";

type Step = "phone" | "verify";

// ✅ تایپ کمکی برای WebOTP
type OTPCredential = {
  code: string;
};

type NavigatorWithOTPCredential = Navigator & {
  credentials: Navigator["credentials"] & {
    get: (options: {
      otp: { transport: string[] };
      signal?: AbortSignal;
    }) => Promise<OTPCredential | null>;
  };
};

const LoginWithOtpForm: React.FC = () => {
  const router = useRouter();
  const { closeModal } = useModalStore();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // ثانیه

  // ⏱ تایمر شمارش معکوس
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // ✅ ارسال کد
  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const trimmedPhone = phone.trim();

    if (!trimmedPhone || trimmedPhone.length !== 11) {
      toast.error("شماره موبایل را صحیح وارد کنید");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: trimmedPhone }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        toast.error(data?.message || "ارسال کد تایید با خطا مواجه شد");
        return;
      }

      toast.success("کد تایید ارسال شد");
      setStep("verify");
      setTimeLeft(120); // ۲ دقیقه
      setOtp(""); // پاک کردن کد قبلی در صورت وجود
    } catch (error) {
      console.error("SEND_OTP_ERROR", error);
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  // ✅ تایید کد و ورود (قابل فراخوانی از submit و از اتوماسیون)
  const handleVerify = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();

      const trimmedOtp = otp.trim();
      const trimmedPhone = phone.trim();

      if (loading) return; // جلوگیری از دابل کلیک / دابل کال

      if (!trimmedOtp || trimmedOtp.length < 4) {
        toast.error("کد تایید را وارد کنید");
        return;
      }

      if (timeLeft <= 0) {
        toast.error("کد منقضی شده است، دوباره ارسال کنید");
        return;
      }

      try {
        setLoading(true);

        const res = await signIn("credentials", {
          redirect: false,
          phone: trimmedPhone,
          otp: trimmedOtp, // 👈 هماهنگ با authOptions
        });

        console.log("SIGNIN_RESULT", res);

        if (res?.ok) {
          toast.success("ورود با موفقیت انجام شد");

          // 🟢 ۱) بستن مودال
          closeModal();

          // 🟢 ۲) رفرش صفحه فعلی (همان آگهی / همان مسیر)
          router.refresh();
        } else {
          toast.error(
            res?.error || "کد تایید نادرست است یا منقضی شده است"
          );
        }
      } catch (error) {
        console.error("VERIFY_OTP_ERROR", error);
        toast.error("خطا در ارتباط با سرور");
      } finally {
        setLoading(false);
      }
    },
    [otp, phone, timeLeft, loading, closeModal, router]
  );

  // ✅ WebOTP API – پر شدن خودکار کد از SMS (مثل اپ بانکی، روی Chrome/Android)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (step !== "verify") return;

    // feature detection بر اساس وجود OTPCredential در window
    if (!("OTPCredential" in window)) return;

    const ac = new AbortController();

    const nav = navigator as unknown as NavigatorWithOTPCredential;

    nav.credentials
      ?.get({
        otp: { transport: ["sms"] },
        signal: ac.signal,
      })
      .then((otpCredential) => {
        if (!otpCredential || !otpCredential.code) return;
        setOtp(otpCredential.code); // مثلاً "9607"
      })
      .catch((err) => {
        console.log("WEB_OTP_ERROR", err);
      });

    return () => {
      ac.abort();
    };
  }, [step]);

  // ✅ اتوماتیک submit شدن وقتی کد کامل شد (چه دستی چه اتومات)
  useEffect(() => {
    if (step !== "verify") return;
    const trimmed = otp.trim();
    if (trimmed.length === 4 && timeLeft > 0 && !loading) {
      void handleVerify(); // بدون نیاز به کلیک روی دکمه
    }
  }, [otp, step, timeLeft, loading, handleVerify]);

  // ارسال مجدد کد - فقط وقتی تایمر تمام شده باشد
  const handleResend = async () => {
    if (timeLeft > 0) {
      return;
    }
    await handleSendCode();
  };

  return (
    <form
      onSubmit={step === "phone" ? handleSendCode : handleVerify}
      className="flex flex-col gap-4 p-4"
    >
      {step === "phone" && (
        <>
          <label className="text-sm font-medium">شماره موبایل</label>
          <Input
            type="tel"
            dir="ltr"
            placeholder="مثلاً 09121234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
            autoComplete="tel"
            inputMode="tel"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "در حال ارسال..." : "ارسال کد تایید"}
          </Button>
        </>
      )}

      {step === "verify" && (
        <>
          <label className="text-sm font-medium">کد تایید</label>
          <Input
            type="tel"
            dir="ltr"
            placeholder="کد 4 رقمی"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={loading}
            autoComplete="one-time-code"
            inputMode="numeric"
            pattern="\d*"
            maxLength={4}
          />

          <div className="text-xs text-gray-500 text-center">
            {timeLeft > 0 ? (
              <>زمان باقیمانده: {formatTime(timeLeft)}</>
            ) : (
              <span className="text-red-500">
                کد منقضی شده است، می‌توانید دوباره ارسال کنید
              </span>
            )}
          </div>

          <div className="flex gap-2 mt-2">
            <Button
              type="submit"
              className="flex-1"
              disabled={loading || timeLeft <= 0}
            >
              {loading ? "در حال ورود..." : "تایید و ورود"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleResend}
              disabled={loading || timeLeft > 0}
            >
              {timeLeft > 0 ? "ارسال مجدد غیرفعال" : "ارسال مجدد کد"}
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export default LoginWithOtpForm;
