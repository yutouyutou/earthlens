import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ArrowLeft, MapPin, Eye, Heart } from "lucide-react"

export default async function FavoritesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/")

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
          thumbnailUrl: true,
          viewerCount: true,
          category: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white/90 transition mb-6 text-sm"
        >
          <ArrowLeft size={16} />
          Back to globe
        </Link>

        <div className="flex items-center gap-2 mb-6">
          <Heart size={20} className="text-red-400" fill="currentColor" />
          <h1 className="text-xl font-bold">Your Favorites</h1>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <Heart size={48} className="mx-auto mb-4 opacity-30" />
            <p>No favorites yet. Explore the globe and save cameras you love.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((fav) => (
              <Link
                key={fav.id}
                href={`/camera/${fav.camera.slug}`}
                className="bg-gray-900/50 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 hover:bg-gray-900/70 transition group"
              >
                <div className="h-36 bg-gray-800">
                  {fav.camera.thumbnailUrl ? (
                    <img src={fav.camera.thumbnailUrl} alt={fav.camera.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10">
                      <Eye size={32} />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm truncate group-hover:text-cyan-300 transition">
                    {fav.camera.title}
                  </h3>
                  <p className="text-white/40 text-xs mt-1 flex items-center gap-1">
                    <MapPin size={10} />
                    {fav.camera.city}, {fav.camera.country}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}