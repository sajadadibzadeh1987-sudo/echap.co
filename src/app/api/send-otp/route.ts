// src/app/api/send-otp/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendOtp } from "@/lib/sendOtp";

function normalizeRequestPhone(raw: unknown): string {
  const phone = (raw ?? "").toString().trim();

  if (!phone) {
    throw new Error("شماره وارد نشده است");
  }

  // فرمت 11 رقمی با 0 در ابتدای شماره (مثل 0912...)
  const regex = /^0\d{10}$/;
  if (!regex.test(phone)) {
    throw new Error("فرمت شماره موبایل صحیح نیست");
  }

  return phone;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = normalizeRequestPhone(body.phone);

    // ساخت کد ۶ رقمی
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // صرفاً برای دیباگ
    console.log("📲 کد تایید برای", phone + ":", otpCode);

    // ۱) ذخیره / به‌روزرسانی کد در دیتابیس با Prisma
    await prisma.oTP.upsert({
      where: { phone },
      update: { code: otpCode, createdAt: new Date() },
      create: { phone, code: otpCode, createdAt: new Date() },
    });

    // ۲) ارسال پیامک واقعی با Edge API جدید
    console.log(">>> BEFORE_SEND_OTP", phone, otpCode);
    await sendOtp(phone, otpCode);
    console.log(">>> AFTER_SEND_OTP", phone, otpCode);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("SEND_OTP_ROUTE_ERROR", err);

    const message =
      err instanceof Error && err.message
        ? err.message
        : "خطا در ارسال کد تایید. لطفا بعدا دوباره تلاش کنید.";

    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
}
