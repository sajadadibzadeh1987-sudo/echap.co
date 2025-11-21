// src/app/api/business-profile/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: Retrieve existing business profile for editing
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.businessProfile.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json(profile);
}

// POST: Create or update business profile
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const userId = session.user.id;
  const data = await req.json();

  try {
    await prisma.businessProfile.upsert({
      where: { userId },
      update: { ...data },
      create: { userId, ...data },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error saving business profile:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
