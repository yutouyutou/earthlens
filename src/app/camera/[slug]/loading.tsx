export default function CameraLoading() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="w-24 h-4 bg-white/5 rounded animate-pulse mb-4" />
        <div className="aspect-video bg-white/5 rounded-xl animate-pulse" />
        <div className="mt-6 bg-white/5 rounded-2xl p-6 animate-pulse space-y-3">
          <div className="w-64 h-8 bg-white/10 rounded" />
          <div className="w-48 h-4 bg-white/10 rounded" />
          <div className="w-full h-16 bg-white/10 rounded mt-4" />
        </div>
      </div>
    </div>
  )
}