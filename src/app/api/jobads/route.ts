import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const phone = formData.get("phone") as string;
  const files = formData.getAll("images") as File[];
  const mainImageIndexRaw = formData.get("mainImageIndex") as string | null;

  if (!title || !description || !category || !phone) {
    return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const imageUrls: string[] = [];

  for (const file of files.slice(0, 5)) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || ".jpg";
    const filename = `${uuidv4()}${ext}`;
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);
    imageUrls.push(`/uploads/${filename}`);
  }

  // پردازش تصویر اصلی
  let finalImageUrls = [...imageUrls];
  const mainImageIndex = mainImageIndexRaw ? parseInt(mainImageIndexRaw) : null;

  if (
    mainImageIndex !== null &&
    !isNaN(mainImageIndex) &&
    mainImageIndex >= 0 &&
    mainImageIndex < imageUrls.length
  ) {
    const mainImage = imageUrls[mainImageIndex];
    finalImageUrls = [
      mainImage,
      ...imageUrls.filter((img, i) => i !== mainImageIndex),
    ];
  }

  const jobAd = await prisma.jobAd.create({
    data: {
      title,
      description,
      category,
      phone,
      userId: session.user.id,
      images: finalImageUrls,
    },
  });

  return NextResponse.json(jobAd, { status: 201 });
}
