import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const search = searchParams.get("search")
  const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 200)

  const where: Record<string, unknown> = { isAlive: true }
  if (category && category !== "ALL") {
    where.category = category
  }
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { city: { contains: search } },
      { country: { contains: search } },
    ]
  }

  const cameras = await prisma.cameraSource.findMany({
    where,
    take: limit,
    orderBy: { viewerCount: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      lat: true,
      lng: true,
      city: true,
      country: true,
      category: true,
      thumbnailUrl: true,
      viewerCount: true,
      isAlive: true,
    },
  })

  return NextResponse.json(cameras)
}