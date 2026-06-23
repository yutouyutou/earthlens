import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")

  const where: Record<string, unknown> = { isAlive: true }
  if (category && category !== "ALL") {
    where.category = category
  }

  const count = await prisma.cameraSource.count({ where })
  if (count === 0) {
    return NextResponse.json({ error: "No cameras found" }, { status: 404 })
  }

  const skip = Math.floor(Math.random() * count)
  const camera = await prisma.cameraSource.findFirst({
    where,
    skip,
    select: { slug: true },
  })

  if (!camera) {
    return NextResponse.json({ error: "No cameras found" }, { status: 404 })
  }

  return NextResponse.json({ slug: camera.slug })
}