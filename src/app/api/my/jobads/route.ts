// app/api/my/jobads/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// ✅ دریافت آگهی‌های کاربر فعلی
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const myAds = await prisma.jobAd.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(myAds, { status: 200 });
  } catch (error) {
    console.error("❌ خطا در دریافت آگهی‌های من:", error);
    return NextResponse.json([], { status: 500 });
  }
}
