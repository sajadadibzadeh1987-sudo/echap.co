import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "ایمیل و رمز عبور الزامی است" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({ error: "کاربری با این ایمیل وجود ندارد" }, { status: 404 })
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      return NextResponse.json({ error: "رمز عبور اشتباه است" }, { status: 401 })
    }

    // در آینده می‌تونیم JWT یا Session اضافه کنیم
    return NextResponse.json({ message: "ورود موفق", user }, { status: 200 })

  } catch (err) {
    console.error("⛔ Login Error:", err)
    return NextResponse.json({ error: "خطای سرور" }, { status: 500 })
  }
}
