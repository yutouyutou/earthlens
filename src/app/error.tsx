"use client"

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="w-screen h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-white/50">Something went wrong</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm transition"
        >
          Try again
        </button>
      </div>
    </div>
  )
}