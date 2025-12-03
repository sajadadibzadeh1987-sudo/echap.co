// src/app/api/coins/check-in/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "ابتدا وارد حساب کاربری شوید." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        coins: true,
        lastCheckIn: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "کاربر پیدا نشد." },
        { status: 404 }
      );
    }

    const now = new Date();
    const today = now.toDateString();

    if (user.lastCheckIn?.toDateString() === today) {
      return NextResponse.json(
        {
          success: false,
          alreadyCheckedIn: true,
          message: "امروز سکه روزانه را دریافت کرده‌اید.",
          coins: user.coins,
        },
        { status: 200 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        coins: user.coins + 2,
        lastCheckIn: now,
      },
      select: {
        coins: true,
        lastCheckIn: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        added: 2,
        coins: updated.coins,
        lastCheckIn: updated.lastCheckIn,
        message: "سکه روزانه با موفقیت اضافه شد.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in /api/coins/check-in:", error);
    return NextResponse.json(
      { success: false, message: "خطای سرور در ثبت سکه روزانه." },
      { status: 500 }
    );
  }
}
