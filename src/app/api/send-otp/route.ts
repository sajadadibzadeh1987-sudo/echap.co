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

const isDev = process.env.NODE_ENV !== "production";
const OTP_TTL_SECONDS = 120; // ۲ دقیقه
const OTP_COOLDOWN_MS = OTP_TTL_SECONDS * 1000;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = normalizeRequestPhone(body.phone);

    // ۰) بررسی cooldown: اگر کد قبلی هنوز اعتبار دارد، اجازه ارسال جدید نده
    const existing = await prisma.oTP.findUnique({
      where: { phone },
    });

    if (existing) {
      const diff = Date.now() - existing.createdAt.getTime();
      if (diff < OTP_COOLDOWN_MS) {
        const remainingSeconds = Math.max(
          1,
          Math.ceil((OTP_COOLDOWN_MS - diff) / 1000)
        );

        console.log(
          "⏱ OTP cooldown for",
          phone,
          "remaining:",
          remainingSeconds,
          "sec"
        );

        return NextResponse.json(
          {
            success: false,
            message:
              "کد قبلی هنوز معتبر است. لطفاً تا پایان زمان باقیمانده منتظر بمانید.",
            remaining: remainingSeconds,
          },
          { status: 429 }
        );
      }
    }

    // ۱) ساخت کد ۴ رقمی
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    console.log("📲 OTP for", phone, "=>", otpCode);

    // ۲) ذخیره / آپدیت OTP در دیتابیس
    const now = new Date();
    await prisma.oTP.upsert({
      where: { phone },
      update: { code: otpCode, createdAt: now },
      create: { phone, code: otpCode, createdAt: now },
    });

    // ۳) ارسال SMS فقط در حالت پروداکشن
    if (!isDev) {
      console.log(">>> SENDING_REAL_OTP_SMS");
      try {
        await sendOtp(phone, otpCode);
        console.log(">>> REAL_OTP_SMS_SENT");
      } catch (smsError) {
        console.error("❌ EDGE_SMS_ERROR", smsError);

        return NextResponse.json(
          {
            success: false,
            message:
              "سامانه پیامکی موقتاً در دسترس نیست. لطفاً چند دقیقه دیگر دوباره تلاش کنید.",
          },
          { status: 503 }
        );
      }
    } else {
      console.log(
        "💡 DEV MODE: SMS واقعی ارسال نشد. از همین لاگ کد را بردار و تست کن."
      );
    }

    // expiresIn برای هماهنگی فرانت
    return NextResponse.json({
      success: true,
      expiresIn: OTP_TTL_SECONDS,
    });
  } catch (err: unknown) {
    console.error("SEND_OTP_ROUTE_ERROR", err);

    const message =
      err instanceof Error && err.message
        ? err.message
        : "خطا در ارسال کد تایید. لطفاً بعداً دوباره تلاش کنید.";

    // 400 چون معمولاً خطای ورودی / فرمت شماره است
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
}
