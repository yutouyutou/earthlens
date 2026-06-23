import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import VideoPlayer from "@/components/VideoPlayer"
import CameraInfoPanel from "@/components/CameraInfoPanel"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function CameraPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const session = await auth()

  const camera = await prisma.cameraSource.findUnique({
    where: { slug },
  })

  if (!camera) notFound()

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  fetch(`${appUrl}/api/cameras/${camera.id}/view`, {
    method: "POST",
  }).catch(() => {})

  let isFavorited = false
  if (session?.user?.id) {
    const fav = await prisma.favorite.findUnique({
      where: {
        userId_cameraId: {
          userId: session.user.id,
          cameraId: camera.id,
        },
      },
    })
    isFavorited = !!fav
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white/90 transition mb-4 text-sm"
        >
          <ArrowLeft size={16} />
          Back to globe
        </Link>

        <VideoPlayer streamUrl={camera.streamUrl} />

        <CameraInfoPanel
          camera={camera}
          isFavorited={isFavorited}
        />
      </div>
    </div>
  )
}