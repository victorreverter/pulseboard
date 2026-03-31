import type { EspnTeam } from "../types/espn"
import { hexToRgba } from "../lib/utils"

interface Props {
  teams: EspnTeam[]
  selectedId?: string
  onSelect?: (team: EspnTeam) => void
  onDoubleClick?: (team: EspnTeam) => void
}

export default function TeamGrid({ teams, selectedId, onSelect, onDoubleClick }: Props) {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
      {teams.map((team) => {
        const logo = team.logos?.find((l) => l.rel.includes("default"))?.href
        const isSelected = team.id === selectedId

        return (
          <button
            key={team.id}
            onClick={() => onSelect?.(team)}
            onDoubleClick={() => onDoubleClick?.(team)}
            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-150 ${
              isSelected
                ? "ring-2 ring-accent bg-accent/10"
                : "hover:bg-surface-hover"
            }`}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{
                background: hexToRgba(team.color, isSelected ? 0.25 : 0.12),
                boxShadow: isSelected ? `0 0 12px ${hexToRgba(team.color, 0.3)}` : "none",
              }}
            >
              {logo ? (
                <img src={logo} alt={team.displayName} className="w-7 h-7 object-contain" />
              ) : (
                <span className="text-xs font-bold" style={{ color: `#${team.color}` }}>
                  {team.abbreviation}
                </span>
              )}
            </div>
            <span className="text-[10px] text-text-secondary truncate w-full text-center">
              {team.abbreviation}
            </span>
          </button>
        )
      })}
    </div>
  )
}
