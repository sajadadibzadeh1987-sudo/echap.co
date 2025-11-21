import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, role } = await req.json();

    if (!userId || !role) {
      return NextResponse.json(
        { success: false, message: "شناسه یا نقش ناقص است" },
        { status: 400 }
      );
    }

    const allowedRoles = ["user", "freelancer", "supplier", "printer"]; // ✅ نقش چاپخانه اضافه شد
    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        { success: false, message: "نقش نامعتبر است" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        role,
        hasSelectedRole: true, // ✅ ست کردن فیلد جدید
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ خطا در API تغییر نقش:", error);
    return NextResponse.json(
      { success: false, message: "خطای سرور" },
      { status: 500 }
    );
  }
}
