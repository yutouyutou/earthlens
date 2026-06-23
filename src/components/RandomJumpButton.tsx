"use client"

import { Shuffle } from "lucide-react"
import { useState } from "react"

export default function RandomJumpButton({ onClick }: { onClick: () => Promise<void> }) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    await onClick()
    setLoading(false)
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-semibold px-5 py-3 rounded-full shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 z-10"
    >
      <Shuffle size={18} className={loading ? "animate-spin" : ""} />
      {loading ? "Jumping..." : "Random Jump"}
    </button>
  )
}