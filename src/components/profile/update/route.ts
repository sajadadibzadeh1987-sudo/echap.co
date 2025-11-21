import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { writeFile } from "fs/promises"
import path from "path"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const avatar = formData.get("avatar") as File | null

    let avatarUrl: string | undefined = undefined

    if (avatar && avatar.size > 0) {
      const buffer = Buffer.from(await avatar.arrayBuffer())
      const filename = `${Date.now()}-${avatar.name}`.replaceAll(" ", "-")
      const filePath = path.join(process.cwd(), "public", "uploads", filename)
      await writeFile(filePath, buffer)
      avatarUrl = `/uploads/${filename}`
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName,
        lastName,
        email,
        ...(avatarUrl && { image: avatarUrl }),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ success: false, message: "Internal Error" }, { status: 500 })
  }
}
