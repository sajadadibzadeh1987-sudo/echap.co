import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await prisma.jobAd.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error("❌ خطا در حذف آگهی:", error);
    return NextResponse.json({ success: false, error: "حذف ناموفق بود" }, { status: 500 });
  }
}
