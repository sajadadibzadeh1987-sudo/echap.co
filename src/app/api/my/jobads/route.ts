import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";  // فقط همین رو نگه دار
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// ✅ دریافت آگهی‌های کاربر فعلی
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const myAds = await prisma.jobAd.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(myAds);
  } catch (error) {
    console.error("❌ خطا در دریافت آگهی‌های من:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// 🗑️ حذف آگهی
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await prisma.jobAd.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error("❌ خطا در حذف آگهی:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// ✏️ ویرایش آگهی
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { title, description } = body;

    const updated = await prisma.jobAd.update({
      where: { id: params.id },
      data: {
        title,
        description,
      },
    });

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error("❌ خطا در ویرایش آگهی:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
