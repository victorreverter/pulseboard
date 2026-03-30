import { SPORTS } from "../config/sports"
import { getSportIcon } from "../config/sports-icons"

interface Props {
  currentId: string
  onChange: (id: string) => void
}

export default function SportTabs({ currentId, onChange }: Props) {
  return (
    <nav className="flex gap-1 overflow-x-auto scrollbar-hide">
      {SPORTS.map((sport) => {
        const active = sport.id === currentId
        return (
          <button
            key={sport.id}
            onClick={() => onChange(sport.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
              active
                ? "bg-accent text-white shadow-sm shadow-accent/30"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
            }`}
            title={sport.name}
          >
            <span className="w-3.5 h-3.5">{getSportIcon(sport.icon)}</span>
            <span>{sport.shortName}</span>
          </button>
        )
      })}
    </nav>
  )
}
