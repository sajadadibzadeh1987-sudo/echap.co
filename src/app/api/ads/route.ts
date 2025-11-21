import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // فرض می‌کنیم prisma client رو ساختیم

export async function GET() {
  const ads = await prisma.jobAd.findMany({
    take: 3, // تعداد آگهی‌ها که می‌خواهی نمایش بدی
    orderBy: {
      createdAt: 'desc', // جدیدترین‌ها اول نمایش داده بشه
    },
  });

  return NextResponse.json(ads); // ارسال به فرانت
}
