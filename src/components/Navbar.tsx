"use client"

import Link from "next/link"
import { Globe, Heart, LogIn, LogOut } from "lucide-react"
import { useSession, signIn, signOut } from "next-auth/react"

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 pointer-events-none">
      <Link
        href="/"
        className="pointer-events-auto flex items-center gap-2 text-white font-bold text-lg hover:opacity-80 transition"
      >
        <Globe size={22} className="text-cyan-400" />
        <span className="hidden sm:inline">EarthLens</span>
      </Link>

      <div className="flex items-center gap-2 pointer-events-auto">
        {session?.user && (
          <Link
            href="/favorites"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition border border-white/10"
          >
            <Heart size={14} />
            <span className="hidden sm:inline">Favorites</span>
          </Link>
        )}

        {session?.user ? (
          <button
            onClick={() => signOut()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition border border-white/10"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        ) : (
          <button
            onClick={() => signIn("github")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition border border-cyan-500/30"
          >
            <LogIn size={14} />
            Sign In
          </button>
        )}
      </div>
    </nav>
  )
}