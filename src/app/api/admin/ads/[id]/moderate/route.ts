// src/app/api/Admin/ads/[id]/moderate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const action = body.action as "APPROVE" | "REJECT" | "DELETE";
    const note = (body.note as string | undefined) ?? null;

    // استخراج id مدیر بدون any
    let adminId: string | undefined;
    if (
      session.user &&
      "id" in session.user &&
      typeof (session.user as { id?: unknown }).id === "string"
    ) {
      adminId = (session.user as { id: string }).id;
    }

    if (!action) {
      return NextResponse.json(
        { error: "نوع عملیات مشخص نشده است." },
        { status: 400 }
      );
    }

    // آگهی را برای دسترسی به userId و title می‌گیریم
    const ad = await prisma.jobAd.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        userId: true,
      },
    });

    if (!ad || !ad.userId) {
      return NextResponse.json(
        { error: "آگهی موردنظر یافت نشد." },
        { status: 404 }
      );
    }

    /**
     * 📩 کمک‌تابع برای ارسال پیام وضعیت به صاحب آگهی در چت
     * توجه: چون مدل ChatMessage فیلد 'sender' اجباری دارد،
     * اینجا آن را "SYSTEM" قرار می‌دهیم تا مشخص باشد پیام سیستمی است.
     */
    const sendStatusMessage = async (text: string) => {
      try {
        await prisma.chatMessage.create({
          data: {
            userId: ad.userId as string,
            text,
            sender: "SYSTEM", // 👈 مقدار ثابت برای پیام‌های سیستمی
          },
        });
      } catch (e) {
        console.error("❌ خطا در ثبت پیام وضعیت آگهی در چت:", e);
      }
    };

    if (action === "APPROVE") {
      await prisma.jobAd.update({
        where: { id },
        data: {
          status: "PUBLISHED",
          moderatedById: adminId ?? null,
          moderatedAt: new Date(),
          moderationNote: note,
          isDeleted: false,
          deletedById: null,
          deletedAt: null,
          deleteReason: null,
        },
      });

      // ✅ پیام چتی برای صاحب آگهی
      await sendStatusMessage(
        `آگهی شما با عنوان «${ad.title}» پس از بررسی تأیید و منتشر شد.`
      );

      return NextResponse.json(
        { message: "آگهی با موفقیت منتشر شد." },
        { status: 200 }
      );
    }

    if (action === "REJECT") {
      await prisma.jobAd.update({
        where: { id },
        data: {
          status: "REJECTED",
          moderatedById: adminId ?? null,
          moderatedAt: new Date(),
          moderationNote: note,
        },
      });

      const reasonText = note ? ` دلیل رد: ${note}` : "";
      await sendStatusMessage(
        `آگهی شما با عنوان «${ad.title}» پس از بررسی رد شد.${reasonText}`
      );

      return NextResponse.json(
        { message: "آگهی با موفقیت رد شد." },
        { status: 200 }
      );
    }

    if (action === "DELETE") {
      await prisma.jobAd.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedById: adminId ?? null,
          deletedAt: new Date(),
          deleteReason: note ?? "حذف توسط مدیر سیستم",
        },
      });

      const reasonText = note
        ? ` دلیل حذف: ${note}`
        : " آگهی توسط مدیر سیستم حذف شد.";
      await sendStatusMessage(
        `آگهی شما با عنوان «${ad.title}» حذف شد.${reasonText}`
      );

      return NextResponse.json(
        { message: "آگهی با موفقیت حذف شد." },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "عملیات نامعتبر است." },
      { status: 400 }
    );
  } catch (error) {
    console.error("❌ POST /api/admin/ads/[id]/moderate error:", error);
    return NextResponse.json(
      { error: "خطای سرور در انجام عملیات مدیر" },
      { status: 500 }
    );
  }
}
