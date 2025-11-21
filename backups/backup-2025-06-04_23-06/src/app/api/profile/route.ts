import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const bio = formData.get("bio") as string;
    const avatarFile = formData.get("avatar") as File | null;

    let avatarPath = undefined;

    // اگر فایل آواتار وجود داشت، ذخیره کن
    if (avatarFile) {
      const buffer = Buffer.from(await avatarFile.arrayBuffer());
      const user = await prisma.user.findUnique({ where: { email: session.user.email } });
      if (!user) return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 404 });

      const uploadDir = path.join(process.cwd(), "public", "uploads", user.id);
      await mkdir(uploadDir, { recursive: true });

      const fileName = "avatar_" + uuidv4() + path.extname(avatarFile.name);
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);

      avatarPath = `/uploads/${user.id}/${fileName}`;
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        phone,
        bio,
        ...(avatarPath ? { avatar: avatarPath } : {}),
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("❌ خطا در ذخیره پروفایل:", error);
    return NextResponse.json({ success: false, message: "خطا در ذخیره پروفایل" }, { status: 500 });
  }
}
