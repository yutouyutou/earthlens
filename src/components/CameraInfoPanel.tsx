"use client"

import type { CameraSource } from "@/types"
import { MapPin, Clock, Eye, Heart } from "lucide-react"
import { useState } from "react"
import { useSession } from "next-auth/react"

export default function CameraInfoPanel({
  camera,
  isFavorited: initialFav,
}: {
  camera: CameraSource
  isFavorited: boolean
}) {
  const [isFavorited, setIsFavorited] = useState(initialFav)
  const [toggling, setToggling] = useState(false)
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user

  const localTime = new Date().toLocaleTimeString("en-US", {
    timeZone: camera.timezone,
    hour: "2-digit",
    minute: "2-digit",
  })

  const handleToggleFavorite = async () => {
    if (!session?.user || toggling) return
    setToggling(true)

    if (isFavorited) {
      await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cameraId: camera.id }),
      })
      setIsFavorited(false)
    } else {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cameraId: camera.id }),
      })
      setIsFavorited(true)
    }

    setToggling(false)
  }

  return (
    <div className="mt-6 bg-gray-900/50 border border-white/10 rounded-2xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{camera.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-white/50 text-sm">
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {camera.city}, {camera.country}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {localTime} local
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} />
              {camera.viewerCount}
            </span>
          </div>
        </div>

        <button
          onClick={handleToggleFavorite}
          disabled={toggling || !isLoggedIn}
          title={!isLoggedIn ? "Sign in to save" : undefined}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all shrink-0 ${
            isFavorited
              ? "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
              : isLoggedIn
                ? "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white"
                : "bg-white/5 text-white/30 border border-white/5 cursor-not-allowed"
          }`}
        >
          <Heart size={16} fill={isFavorited ? "currentColor" : "none"} />
          {isFavorited ? "Saved" : "Save"}
        </button>
      </div>

      {camera.description && (
        <p className="mt-4 text-white/40 text-sm leading-relaxed max-w-2xl">
          {camera.description}
        </p>
      )}
    </div>
  )
}