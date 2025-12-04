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

    // ساخت کد ۴ رقمی
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    // صرفاً برای دیباگ
    console.log("📲 کد تایید برای", phone + ":", otpCode);

    const now = new Date();

    // ۱) ذخیره / آپدیت OTP در دیتابیس
    await prisma.oTP.upsert({
      where: { phone },
      update: { code: otpCode, createdAt: now },
      create: { phone, code: otpCode, createdAt: now },
    });

    // ۲) تلاش برای ارسال SMS
    console.log(">>> BEFORE_SEND_OTP", phone, otpCode);

    try {
      await sendOtp(phone, otpCode);
      console.log(">>> AFTER_SEND_OTP", phone, otpCode);
    } catch (smsError) {
      console.error("❌ EDGE_SMS_ERROR", smsError);

      // پیام محترمانه برای کاربر وقتی سرویس SMS قطع است
      return NextResponse.json(
        {
          success: false,
          message:
            "سامانه پیامکی موقتاً در دسترس نیست. لطفاً چند دقیقه دیگر دوباره تلاش کنید.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: unknown) {
    console.error("SEND_OTP_ROUTE_ERROR", err);

    const message =
      err instanceof Error && err.message
        ? err.message
        : "خطا در ارسال کد تایید. لطفاً بعداً دوباره تلاش کنید.";

    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
}
