import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// نقش‌هایی که کاربر می‌تواند در فرم انتخاب کند
const ALLOWED_ROLES = ["user", "freelancer", "supplier"];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: "تمام فیلدها الزامی هستند" }, { status: 400 });
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return NextResponse.json({ message: "نقش نامعتبر است" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: "این ایمیل قبلاً ثبت شده است" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json({ message: "ثبت‌نام موفق بود" }, { status: 200 });
  } catch (error) {
    console.error("❌ Register error:", error);
    return NextResponse.json({ message: "خطای سرور. دوباره تلاش کنید." }, { status: 500 });
  }
}
