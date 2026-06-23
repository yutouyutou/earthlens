import type { CameraSource, Favorite } from "@prisma/client"

export type CameraWithFavorite = CameraSource & {
  isFavorited?: boolean
}

export type CameraMarker = {
  id: string
  slug: string
  lat: number
  lng: number
  title: string
  city: string
  country: string
  category: string
  thumbnailUrl: string | null
  viewerCount: number
}

export type { CameraSource, Favorite }