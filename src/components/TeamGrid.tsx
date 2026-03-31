import type { EspnTeam } from "../types/espn"
import { hexToRgba } from "../lib/utils"

interface Props {
  teams: EspnTeam[]
  selectedId?: string
  onSelect?: (team: EspnTeam) => void
  onInfo?: (team: EspnTeam) => void
}

export default function TeamGrid({ teams, selectedId, onSelect, onInfo }: Props) {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
      {teams.map((team) => {
        const logo = team.logos?.find((l) => l.rel.includes("default"))?.href
        const isSelected = team.id === selectedId

        return (
          <div
            key={team.id}
            className={`relative flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-150 cursor-pointer ${
              isSelected
                ? "ring-2 ring-accent bg-accent/10"
                : "hover:bg-surface-hover"
            }`}
            onClick={() => onSelect?.(team)}
          >
            {onInfo && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onInfo(team)
                }}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-border/50 hover:bg-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Team details"
              >
                <svg className="w-3 h-3 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            )}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: hexToRgba(team.color, isSelected ? 0.25 : 0.12),
                boxShadow: isSelected ? `0 0 12px ${hexToRgba(team.color, 0.3)}` : "none",
              }}
            >
              {logo ? (
                <img src={logo} alt={team.displayName} className="w-7 h-7 object-contain" loading="lazy" />
              ) : (
                <span className="text-xs font-bold" style={{ color: `#${team.color}` }}>
                  {team.abbreviation}
                </span>
              )}
            </div>
            <span className="text-[10px] text-text-secondary truncate w-full text-center">
              {team.abbreviation}
            </span>
          </div>
        )
      })}
    </div>
  )
}
