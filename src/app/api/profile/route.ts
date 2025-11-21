import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const token = await getToken({ req });

  if (!token || !token.phone) {
    console.error("❌ توکن یافت نشد یا شماره تلفن ندارد:", token);
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const newEmail = formData.get("email") as string;
    const avatarFile = formData.get("avatar") as File | null;

    const user = await prisma.user.findUnique({
      where: { phone: token.phone },
    });

    if (!user) {
      console.error("❌ کاربری با این شماره پیدا نشد:", token.phone);
      return NextResponse.json({ message: "کاربر یافت نشد" }, { status: 404 });
    }

    // بررسی تکراری بودن ایمیل در صورت تغییر
    if (newEmail && newEmail !== user.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: newEmail },
      });

      if (emailExists) {
        console.warn("⚠️ ایمیل تکراری:", newEmail);
        return NextResponse.json(
          { success: false, message: "ایمیل وارد شده قبلاً ثبت شده است" },
          { status: 400 }
        );
      }
    }

    let avatarPath: string | undefined = undefined;

    if (avatarFile) {
      const buffer = Buffer.from(await avatarFile.arrayBuffer());

      const uploadDir = path.join(process.cwd(), "public", "uploads", user.id);
      await mkdir(uploadDir, { recursive: true });

      const fileName = "avatar_" + uuidv4() + path.extname(avatarFile.name);
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);

      avatarPath = `/uploads/${user.id}/${fileName}`;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName,
        lastName,
        email: newEmail,
        ...(avatarPath ? { image: avatarPath } : {}),
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("❌ خطای غیرمنتظره در ذخیره پروفایل:", error);
    return NextResponse.json(
      { success: false, message: "خطا در ذخیره پروفایل" },
      { status: 500 }
    );
  }
}
