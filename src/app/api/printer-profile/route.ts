// src/app/api/printer-profile/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "printer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.printingHouseProfile.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json(profile);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "printer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const {
    name,
    slug,
    address,
    phone,
    website,
    locationLat,
    locationLng,
    logoUrl,
    description,
    openingHours,
  } = body;

  const data = {
    name,
    slug,
    address,
    phone,
    website,
    logoUrl,
    description,
    openingHours,
    lat: locationLat,
    lng: locationLng,
  };

  const existing = await prisma.printingHouseProfile.findUnique({
    where: { userId: session.user.id },
  });

  let updated;
  if (existing) {
    updated = await prisma.printingHouseProfile.update({
      where: { userId: session.user.id },
      data,
    });
  } else {
    updated = await prisma.printingHouseProfile.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    });
  }

  return NextResponse.json(updated);
}
