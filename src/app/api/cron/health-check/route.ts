import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const cameras = await prisma.cameraSource.findMany({
    select: { id: true, streamUrl: true },
  })

  let checked = 0
  let dead = 0

  for (const cam of cameras) {
    checked++
    try {
      const isYouTube = cam.streamUrl.includes("youtube.com")
      if (isYouTube) continue

      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)

      const res = await fetch(cam.streamUrl, {
        method: "HEAD",
        signal: controller.signal,
      })
      clearTimeout(timeout)

      if (!res.ok) {
        await prisma.cameraSource.update({
          where: { id: cam.id },
          data: { isAlive: false },
        })
        dead++
      } else {
        await prisma.cameraSource.update({
          where: { id: cam.id },
          data: { isAlive: true },
        })
      }
    } catch {
      await prisma.cameraSource.update({
        where: { id: cam.id },
        data: { isAlive: false },
      })
      dead++
    }
  }

  return NextResponse.json({ checked, dead, alive: checked - dead })
}