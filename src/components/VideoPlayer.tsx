"use client"

import { useEffect, useRef, useState } from "react"
import Hls from "hls.js"
import { Loader2, AlertTriangle } from "lucide-react"

export default function VideoPlayer({ streamUrl }: { streamUrl: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  const isYouTube = streamUrl.includes("youtube.com") || streamUrl.includes("youtu.be")

  useEffect(() => {
    if (isYouTube) {
      setLoading(false)
      return
    }

    if (!videoRef.current) return

    const video = videoRef.current

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      })
      hls.loadSource(streamUrl)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false)
        video.play().catch(() => setError(true))
      })
      hls.on(Hls.Events.ERROR, () => {
        setError(true)
        setLoading(false)
      })

      return () => {
        hls.destroy()
      }
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl
      video.addEventListener("loadedmetadata", () => {
        setLoading(false)
        video.play().catch(() => setError(true))
      })
      video.addEventListener("error", () => setError(true))

      return () => {
        video.src = ""
      }
    } else {
      setError(true)
      setLoading(false)
    }
  }, [streamUrl, isYouTube])

  if (isYouTube) {
    const videoId = streamUrl.match(/(?:v=|\/)([\w-]{11})/)?.[1]
    return (
      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
        {videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&modestbranding=1`}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white/50">
            <AlertTriangle size={24} />
            <span className="ml-2">Invalid video URL</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <Loader2 size={32} className="animate-spin text-cyan-400" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 gap-2">
          <AlertTriangle size={32} className="text-amber-400" />
          <p className="text-white/50 text-sm">Stream unavailable right now</p>
        </div>
      )}

      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        muted
        playsInline
        crossOrigin="anonymous"
      />
    </div>
  )
}