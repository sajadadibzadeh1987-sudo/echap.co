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

    // ✅ بدون any
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
