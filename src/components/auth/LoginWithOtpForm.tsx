// src/components/auth/LoginWithOtpForm.tsx
"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useModalStore from "@/hooks/use-modal-store";

type Step = "phone" | "verify";

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

const OTP_LENGTH = 4;
const OTP_TTL_SECONDS = 120;

const getOtpStorageKey = (phone: string) =>
  `echap_otp_expire_${phone}`;

const setOtpExpireInStorage = (phone: string, seconds: number) => {
  if (typeof window === "undefined") return;
  const key = getOtpStorageKey(phone);
  const expireAt = Date.now() + seconds * 1000;
  localStorage.setItem(key, String(expireAt));
};

const getOtpRemainingFromStorage = (phone: string): number => {
  if (typeof window === "undefined") return 0;
  const key = getOtpStorageKey(phone);
  const raw = localStorage.getItem(key);
  if (!raw) return 0;
  const expireAt = Number(raw);
  if (!expireAt || Number.isNaN(expireAt)) return 0;
  const diffMs = expireAt - Date.now();
  if (diffMs <= 0) {
    localStorage.removeItem(key);
    return 0;
  }
  return Math.floor(diffMs / 1000);
};

const clearOtpExpireStorage = (phone: string) => {
  if (typeof window === "undefined") return;
  const key = getOtpStorageKey(phone);
  localStorage.removeItem(key);
};

const LoginWithOtpForm: React.FC = () => {
  const router = useRouter();
  const { closeModal } = useModalStore();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // ثانیه
  const [shake, setShake] = useState(false);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const autoSubmitRef = useRef(false);

  const trimmedPhone = phone.trim();
  const otp = otpDigits.join("");

  console.log("✅ LoginWithOtpForm PRO mounted, step:", step);

  // ⏱ تایمر شمارش معکوس + پاک کردن localStorage وقتی صفر شد
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (trimmedPhone) {
            clearOtpExpireStorage(trimmedPhone);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, trimmedPhone]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const focusInput = (index: number) => {
    const el = inputsRef.current[index];
    if (el) {
      el.focus();
      el.select();
    }
  };

  const handleOtpChange = (
    index: number,
    value: string
  ) => {
    if (!/^\d?$/.test(value)) return;

    setOtpDigits((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });

    if (value && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (otpDigits[index]) {
        setOtpDigits((prev) => {
          const copy = [...prev];
          copy[index] = "";
          return copy;
        });
        return;
      }
      if (index > 0) {
        focusInput(index - 1);
        setOtpDigits((prev) => {
          const copy = [...prev];
          copy[index - 1] = "";
          return copy;
        });
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusInput(index - 1);
    }

    if (
      e.key === "ArrowRight" &&
      index < OTP_LENGTH - 1
    ) {
      e.preventDefault();
      focusInput(index + 1);
    }
  };

  const handleOtpPaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;

    const nextDigits = Array(OTP_LENGTH)
      .fill("")
      .map((_, i) => pasted[i] ?? "");
    setOtpDigits(nextDigits);

    const filledLength = nextDigits.filter(Boolean).length;
    const focusIndex = Math.min(
      filledLength,
      OTP_LENGTH - 1
    );
    focusInput(focusIndex);
  };

  // لود تایمر از localStorage در حالت verify
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (step !== "verify") return;
    if (!trimmedPhone) return;

    const remaining = getOtpRemainingFromStorage(trimmedPhone);
    if (remaining > 0) {
      setTimeLeft(remaining);
    } else {
      setTimeLeft(0);
    }
  }, [step, trimmedPhone]);

  // ✅ ارسال کد (با cooldown سروری)
  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!trimmedPhone || trimmedPhone.length !== 11) {
      toast.error("شماره موبایل را صحیح وارد کنید");
      return;
    }

    try {
      setLoading(true);
      autoSubmitRef.current = false;

      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: trimmedPhone }),
      });

      const data: {
        success?: boolean;
        message?: string;
        remaining?: number;
        expiresIn?: number;
      } = await res.json().catch(() => ({}));

      if (res.status === 429) {
        const remaining =
          typeof data.remaining === "number"
            ? data.remaining
            : 0;

        if (remaining > 0) {
          setStep("verify");
          setOtpDigits(Array(OTP_LENGTH).fill(""));
          setTimeLeft(remaining);
          setOtpExpireInStorage(trimmedPhone, remaining);
        }

        toast.error(
          data.message ||
            "شما به‌تازگی کد دریافت کرده‌اید. لطفاً کمی صبر کنید."
        );
        return;
      }

      if (!res.ok || !data?.success) {
        toast.error(
          data?.message || "ارسال کد تایید با خطا مواجه شد"
        );
        return;
      }

      const ttl =
        typeof data.expiresIn === "number"
          ? data.expiresIn
          : OTP_TTL_SECONDS;

      toast.success("کد تایید ارسال شد");
      setStep("verify");
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      setTimeLeft(ttl);
      setOtpExpireInStorage(trimmedPhone, ttl);

      setTimeout(() => {
        focusInput(0);
      }, 100);
    } catch (error) {
      console.error("SEND_OTP_ERROR", error);
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  // ✅ تایید کد و ورود (برای auto-submit هم از همین استفاده می‌کنیم)
  const handleVerify = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();

      if (loading) return;

      const trimmedOtp = otp.trim();

      if (!trimmedOtp || trimmedOtp.length < OTP_LENGTH) {
        toast.error("کد تایید را کامل وارد کنید");
        setShake(true);
        setTimeout(() => setShake(false), 200);
        return;
      }

      if (timeLeft <= 0) {
        toast.error("کد منقضی شده است، دوباره ارسال کنید");
        setShake(true);
        setTimeout(() => setShake(false), 200);
        return;
      }

      try {
        setLoading(true);

        const res = await signIn("credentials", {
          redirect: false,
          phone: trimmedPhone,
          otp: trimmedOtp,
        });

        console.log("SIGNIN_RESULT", res);

        if (res?.ok) {
          toast.success("ورود با موفقیت انجام شد");
          clearOtpExpireStorage(trimmedPhone);
          autoSubmitRef.current = false;
          closeModal();
          router.refresh();
        } else {
          toast.error(
            res?.error ||
              "کد تایید نادرست است یا منقضی شده است"
          );
          setShake(true);
          setTimeout(() => setShake(false), 200);
        }
      } catch (error) {
        console.error("VERIFY_OTP_ERROR", error);
        toast.error("خطا در ارتباط با سرور");
      } finally {
        setLoading(false);
      }
    },
    [otp, trimmedPhone, timeLeft, loading, closeModal, router]
  );

  // ✅ WebOTP – خواندن خودکار SMS → پر کردن باکس‌ها
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (step !== "verify") return;

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
        const code = otpCredential.code
          .replace(/\D/g, "")
          .slice(0, OTP_LENGTH);

        if (!code) return;

        const nextDigits = Array(OTP_LENGTH)
          .fill("")
          .map((_, i) => code[i] ?? "");

        setOtpDigits(nextDigits);

        // فوکوس روی اولین باکس (صرفاً برای حس فعال بودن)
        focusInput(0);
      })
      .catch((err) => {
        if (err?.name !== "AbortError") {
          console.log("WEB_OTP_ERROR", err);
        }
      });

    return () => {
      ac.abort();
    };
  }, [step]);

  // ✅ auto-submit بعد از کامل شدن کد (چه دستی، چه WebOTP)
  useEffect(() => {
    if (step !== "verify") return;
    const code = otp.trim();

    if (
      code.length === OTP_LENGTH &&
      timeLeft > 0 &&
      !loading &&
      !autoSubmitRef.current
    ) {
      autoSubmitRef.current = true;
      void handleVerify();
    } else if (code.length < OTP_LENGTH) {
      autoSubmitRef.current = false;
    }
  }, [otp, step, timeLeft, loading, handleVerify]);

  const handleResend = async () => {
    if (timeLeft > 0) {
      return;
    }
    await handleSendCode();
  };

  // درصد پیشرفت برای نوار دور دکمه «ارسال مجدد»
  const progressPercent =
    timeLeft > 0
      ? Math.max(
          0,
          Math.min(
            100,
            (timeLeft / OTP_TTL_SECONDS) * 100
          )
        )
      : 0;

  return (
    <form
      onSubmit={step === "phone" ? handleSendCode : handleVerify}
      className="flex flex-col gap-4 p-4"
      dir="rtl"
    >
      {step === "phone" && (
        <div className="space-y-3">
          <div className="text-center mb-1">
            <h2 className="text-lg font-semibold">
              ورود / ثبت‌نام با شماره موبایل
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              کد تأیید به شماره شما پیامک می‌شود؛ نیازی به
              رمز عبور نیست.
            </p>
          </div>

          <div className="space-y-2 mt-2">
            <label className="text-sm font-medium">
              شماره موبایل
            </label>
            <Input
              type="tel"
              dir="ltr"
              placeholder="مثلاً 09121234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
              autoComplete="tel"
              inputMode="tel"
              className="text-center tracking-[0.08em]"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-2"
          >
            {loading ? "در حال ارسال..." : "ارسال کد تایید"}
          </Button>

          <p className="text-[10px] text-gray-400 text-center mt-1">
            با ادامه، قوانین استفاده از ایچاپ را می‌پذیرید.
          </p>
        </div>
      )}

      {step === "verify" && (
        <>
          <div className="text-center mb-2">
            <h2 className="text-lg font-semibold">
              کد تأیید را وارد کنید
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              کد ۴ رقمی برای شماره{" "}
              <span className="font-semibold">
                {trimmedPhone}
              </span>{" "}
              ارسال شده است.
            </p>
          </div>

          {/* OTP Boxes - چپ به راست، مثل اپ‌های بانکی */}
          <div
            dir="ltr"
            className={`flex items-center justify-center gap-3 ${
              shake ? "animate-pulse" : ""
            }`}
          >
            {Array.from({ length: OTP_LENGTH }).map(
              (_, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  type="tel"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={1}
                  dir="ltr"
                  className="w-12 h-12 md:w-14 md:h-14 text-center text-xl md:text-2xl font-semibold rounded-2xl border border-gray-200 bg-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-transform duration-150 ease-out hover:scale-105"
                  value={otpDigits[index]}
                  onChange={(e) =>
                    handleOtpChange(
                      index,
                      e.target.value
                    )
                  }
                  onKeyDown={(e) =>
                    handleOtpKeyDown(index, e)
                  }
                  onPaste={index === 0 ? handleOtpPaste : undefined}
                />
              )
            )}
          </div>

          {/* فقط متن زمان، بدون نوار زیر باکس‌ها */}
          <div className="mt-2 flex flex-col items-center gap-1 text-xs text-gray-500">
            {timeLeft > 0 ? (
              <span>
                زمان باقیمانده:{" "}
                <span className="font-semibold">
                  {formatTime(timeLeft)}
                </span>
              </span>
            ) : (
              <span className="text-red-500">
                کد منقضی شده است، می‌توانید دوباره ارسال
                کنید.
              </span>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={loading || timeLeft <= 0}
            >
              {loading ? "در حال ورود..." : "تایید و ورود"}
            </Button>

            {/* دکمه ارسال مجدد با نوار countdown دور خودش */}
            <div className="flex-1 relative">
              <Button
                type="button"
                variant="outline"
                className="w-full relative overflow-hidden"
                onClick={handleResend}
                disabled={loading || timeLeft > 0}
              >
                {timeLeft > 0
                  ? `ارسال مجدد پس از ${formatTime(
                      timeLeft
                    )}`
                  : "ارسال مجدد کد"}

                {timeLeft > 0 && (
                  <span
                    className="pointer-events-none absolute inset-x-1 bottom-0 h-0.5 rounded-full bg-blue-500/80 transition-[width] duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </form>
  );
};

export default LoginWithOtpForm;
