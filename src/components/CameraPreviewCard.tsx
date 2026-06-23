"use client"

import type { CameraMarker } from "@/types"
import { X, MapPin, Eye, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function CameraPreviewCard({
  camera,
  onClose,
}: {
  camera: CameraMarker
  onClose: () => void
}) {
  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-4 md:bottom-8 w-80 bg-gray-900/90 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-20">
      {camera.thumbnailUrl && (
        <div className="h-36 bg-gray-800 relative">
          <img
            src={camera.thumbnailUrl}
            alt={camera.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur rounded-full hover:bg-black/70 transition"
          >
            <X size={14} className="text-white" />
          </button>
        </div>
      )}

      {!camera.thumbnailUrl && (
        <div className="flex justify-end p-2">
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition">
            <X size={14} />
          </button>
        </div>
      )}

      <div className="p-4">
        <h3 className="font-semibold text-white text-base truncate">{camera.title}</h3>
        <p className="text-white/50 text-sm flex items-center gap-1 mt-1">
          <MapPin size={12} />
          {camera.city}, {camera.country}
        </p>

        <div className="flex items-center gap-4 mt-3 text-xs text-white/40">
          <span className="flex items-center gap-1">
            <Eye size={12} />
            {camera.viewerCount}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/50 text-xs capitalize">
            {camera.category.toLowerCase()}
          </span>
        </div>

        <Link
          href={`/camera/${camera.slug}`}
          className="mt-3 flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium py-2 rounded-xl transition"
        >
          <ExternalLink size={14} />
          Watch Live
        </Link>
      </div>
    </div>
  )
}