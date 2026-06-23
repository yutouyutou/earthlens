import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      camera: {
        select: {
          id: true,
          slug: true,
          title: true,
          city: true,
          country: true,
          category: true,
          thumbnailUrl: true,
          viewerCount: true,
          isAlive: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(favorites)
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { cameraId } = await request.json()

  const favorite = await prisma.favorite.create({
    data: {
      userId: session.user.id,
      cameraId,
    },
  })

  return NextResponse.json(favorite)
}

export async function DELETE(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { cameraId } = await request.json()

  await prisma.favorite.deleteMany({
    where: {
      userId: session.user.id,
      cameraId,
    },
  })

  return NextResponse.json({ ok: true })
}