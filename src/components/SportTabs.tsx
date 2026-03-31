import { SPORTS } from "../config/sports"
import { getSportIcon } from "../config/sports-icons"

interface Props {
  currentId: string
  onChange: (id: string) => void
}

export default function SportTabs({ currentId, onChange }: Props) {
  return (
    <nav className="flex gap-1 overflow-x-auto scrollbar-hide">
      <button
        onClick={() => onChange("home")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 ${
          currentId === "home"
            ? "bg-accent text-white shadow-sm shadow-accent/30"
            : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span>Home</span>
      </button>

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
