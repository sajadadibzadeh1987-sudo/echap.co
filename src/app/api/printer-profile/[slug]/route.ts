import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params

  if (!slug) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
  }

  try {
    const profile = await prisma.printShopProfile.findUnique({
      where: { slug },
    })

    if (!profile) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (err) {
    console.error('Error loading profile:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
