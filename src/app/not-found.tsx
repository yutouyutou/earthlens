import Link from "next/link"
import { Globe } from "lucide-react"

export default function NotFound() {
  return (
    <div className="w-screen h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Globe size={48} className="mx-auto text-white/20" />
        <h1 className="text-2xl font-bold text-white">Camera not found</h1>
        <p className="text-white/40 text-sm">This stream may have gone offline or moved.</p>
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-full text-sm transition mt-4"
        >
          Back to globe
        </Link>
      </div>
    </div>
  )
}