"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import mapboxgl from "mapbox-gl"
import type { CameraMarker } from "@/types"
import CategoryBar from "./CategoryBar"
import RandomJumpButton from "./RandomJumpButton"
import CameraPreviewCard from "./CameraPreviewCard"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

export default function MapCanvas() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [cameras, setCameras] = useState<CameraMarker[]>([])
  const [selectedCamera, setSelectedCamera] = useState<CameraMarker | null>(null)
  const [category, setCategory] = useState<string>("ALL")
  const [loading, setLoading] = useState(true)

  const fetchCameras = useCallback(async (cat: string) => {
    setLoading(true)
    const params = new URLSearchParams()
    if (cat !== "ALL") params.set("category", cat)
    try {
      const res = await fetch(`/api/cameras?${params}`)
      const data = await res.json()
      setCameras(data)
    } catch (e) {
      console.error("Failed to fetch cameras", e)
    }
    setLoading(false)
  }, [])

  // Init map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      projection: "globe",
      center: [0, 20],
      zoom: 1.5,
      minZoom: 1,
      maxZoom: 18,
      pitch: 0,
    })

    map.current.on("style.load", () => {
      if (!map.current) return
      map.current.setFog({
        color: "rgb(10, 10, 10)",
        "high-color": "rgb(30, 40, 80)",
        "horizon-blend": 0.2,
        "space-color": "rgb(5, 5, 15)",
        "star-intensity": 0.6,
      })
    })

    map.current.addControl(new mapboxgl.NavigationControl(), "bottom-right")

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [])

  // Fetch cameras on mount and category change
  useEffect(() => {
    fetchCameras(category)
  }, [category, fetchCameras])

  // Update markers when cameras change
  useEffect(() => {
    if (!map.current) return

    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    cameras.forEach((cam) => {
      const el = document.createElement("div")
      el.className = "camera-marker"
      el.innerHTML = `<div style="width:12px;height:12px;border-radius:50%;background:#22d3ee;box-shadow:0 0 12px rgba(34,211,238,0.5);cursor:pointer;"></div>`
      el.onclick = () => setSelectedCamera(cam)

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([cam.lng, cam.lat])
        .addTo(map.current!)

      markersRef.current.push(marker)
    })
  }, [cameras])

  // Auto-rotate globe — pauses instantly on any user interaction, resumes after idle
  useEffect(() => {
    if (!map.current) return
    const secondsPerRevolution = 160
    let animationId = 0
    let idleTimer: ReturnType<typeof setTimeout> | null = null
    let interacting = false

    const spinGlobe = () => {
      if (!map.current || interacting || !animationId) return
      const center = map.current.getCenter()
      center.lng += 360 / (secondsPerRevolution * 60)
      if (center.lng > 180) center.lng -= 360
      map.current.setCenter(center)
      animationId = requestAnimationFrame(spinGlobe)
    }

    const stopSpin = () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
        animationId = 0
      }
      if (idleTimer) {
        clearTimeout(idleTimer)
        idleTimer = null
      }
    }

    const onInteractionStart = () => {
      interacting = true
      stopSpin()
    }

    const onInteractionEnd = () => {
      interacting = false
      if (idleTimer) clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        if (!interacting && map.current && !map.current.isMoving() && !animationId) {
          animationId = requestAnimationFrame(spinGlobe)
        }
      }, 2000)
    }

    const m = map.current
    m.on("mousedown", onInteractionStart)
    m.on("touchstart", onInteractionStart)
    m.on("wheel", onInteractionStart)
    m.on("dragend", onInteractionEnd)
    m.on("moveend", onInteractionEnd)
    m.on("zoomend", onInteractionEnd)
    m.on("load", () => {
      animationId = requestAnimationFrame(spinGlobe)
    })

    return () => {
      stopSpin()
    }
  }, [])

  const handleRandomJump = async () => {
    const params = new URLSearchParams()
    if (category !== "ALL") params.set("category", category)
    try {
      const res = await fetch(`/api/cameras/random?${params}`)
      const data = await res.json()
      if (data.slug) {
        window.location.href = `/camera/${data.slug}`
      }
    } catch (e) {
      console.error("Random jump failed", e)
    }
  }

  return (
    <div className="relative w-screen h-screen">
      <div ref={mapContainer} className="w-full h-full" />

      {loading && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur px-4 py-2 rounded-full text-sm text-white/70 z-10">
          Loading cameras...
        </div>
      )}

      <CategoryBar selected={category} onSelect={setCategory} />
      <RandomJumpButton onClick={handleRandomJump} />

      {selectedCamera && (
        <CameraPreviewCard
          camera={selectedCamera}
          onClose={() => setSelectedCamera(null)}
        />
      )}
    </div>
  )
}