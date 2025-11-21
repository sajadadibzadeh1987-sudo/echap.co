// src/app/api/send-otp/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  // فقط شماره موبایل را از body می‌خوانیم
  const { phone }: { phone?: string } = await req.json();
  const trimmedPhone = phone?.trim();

  if (!trimmedPhone) {
    return NextResponse.json(
      { error: "شماره وارد نشده" },
      { status: 400 }
    );
  }

  // تولید کد شش رقمی و زمان انقضاء
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 2 * 60 * 1000); // ۲ دقیقه

  const existingUser = await prisma.user.findUnique({
    where: { phone: trimmedPhone },
  });

  if (existingUser) {
    // اگر کاربر قبلاً ثبت‌نام کرده، فقط OTP را به‌روز کن
    await prisma.user.update({
      where: { phone: trimmedPhone },
      data: { otp, otpExpiry: expiry },
    });
  } else {
    // کاربر جدید با نقش پیش‌فرض "user"
    await prisma.user.create({
      data: {
        phone: trimmedPhone,
        otp,
        otpExpiry: expiry,
        // نقش به‌صورت پیش‌فرض در مدل User = "user"
      },
    });
  }

  console.log(`📲 کد تایید برای ${trimmedPhone}: ${otp}`);

  return NextResponse.json({ success: true });
}
