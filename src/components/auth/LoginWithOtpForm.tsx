"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginWithOtpForm() {
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"phone" | "verify">("phone");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendCode = async () => {
    if (!phone.trim()) return toast.error("شماره را وارد کنید");
    setLoading(true);
    try {
      await axios.post("/api/send-otp", { phone });
      toast.success("کد تایید ارسال شد");
      setStep("verify");
    } catch (err: unknown) {
      toast.error(
        axios.isAxiosError(err)
          ? err.response?.data?.error || "خطا در ارسال کد"
          : "خطای ناشناخته"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otp.trim()) return toast.error("کد تایید را وارد کنید");
    setLoading(true);
    const res = await signIn("credentials", {
      phone,
      otp,
      redirect: false,
    });
    setLoading(false);

    if (res?.ok) {
      toast.success("ورود موفق");
      router.push("/dashboard");
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
          <Button onClick={handleSendCode} disabled={loading} className="w-full">
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
          <Button onClick={handleVerify} disabled={loading} className="w-full">
            {loading ? "در حال ورود..." : "تایید و ورود"}
          </Button>
        </>
      )}
    </div>
  );
}
