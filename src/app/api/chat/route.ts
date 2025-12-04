// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error("❌ GET /api/chat error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const text: string = body.text;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "پیام خالی قابل ارسال نیست" },
        { status: 400 }
      );
    }

    const msg = await prisma.chatMessage.create({
      data: {
        userId: session.user.id,
        sender: "USER",
        text,
      },
    });

    return NextResponse.json(msg, { status: 201 });
  } catch (error) {
    console.error("❌ POST /api/chat error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
