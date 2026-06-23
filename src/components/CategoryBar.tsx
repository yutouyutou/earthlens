"use client"

import { Palmtree, Building2, Mountain, PartyPopper, Globe } from "lucide-react"

const categories = [
  { key: "ALL", label: "All", icon: <Globe size={16} /> },
  { key: "BEACH", label: "Beach", icon: <Palmtree size={16} /> },
  { key: "CITY", label: "City", icon: <Building2 size={16} /> },
  { key: "NATURE", label: "Nature", icon: <Mountain size={16} /> },
  { key: "EVENT", label: "Event", icon: <PartyPopper size={16} /> },
]

export default function CategoryBar({
  selected,
  onSelect,
}: {
  selected: string
  onSelect: (cat: string) => void
}) {
  return (
    <div className="absolute top-16 left-4 flex gap-1 bg-black/50 backdrop-blur-md rounded-full p-1 border border-white/10 overflow-x-auto max-w-[calc(100vw-2rem)]">
      {categories.map(({ key, label, icon }) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
            selected === key
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
              : "text-white/60 hover:text-white/90 hover:bg-white/5"
          }`}
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  )
}