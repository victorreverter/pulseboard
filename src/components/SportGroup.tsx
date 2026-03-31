import type { EspnEvent } from "../types/espn"
import type { SportEvent } from "../hooks/useMultiSport"
import type { SportConfig } from "../config/sports"
import { getSportIcon } from "../config/sports-icons"
import MiniGameCard from "./MiniGameCard"

interface Props {
  sport: SportConfig
  events: SportEvent[]
  onGameClick?: (event: EspnEvent) => void
  onSeeAll?: (sportId: string) => void
  limit?: number
}

export default function SportGroup({ sport, events, onGameClick, onSeeAll, limit = 5 }: Props) {
  if (events.length === 0) return null

  const visible = events.slice(0, limit)
  const remaining = events.length - limit
  const icon = getSportIcon(sport.icon)

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 text-accent">{icon}</span>
          <h2 className="text-sm font-bold text-text-primary">{sport.name}</h2>
          <span className="text-[10px] text-text-muted font-mono">
            {events.length} {events.length === 1 ? "game" : "games"}
          </span>
        </div>
        {remaining > 0 && (
          <button
            onClick={() => onSeeAll?.(sport.id)}
            className="text-[10px] font-medium text-accent hover:text-accent/80 transition-colors"
          >
            See all {events.length} →
          </button>
        )}
      </div>

      <div className="space-y-1">
        {visible.map((se) => (
          <MiniGameCard
            key={se.event.id}
            sportEvent={se}
            onClick={onGameClick}
            variant="compact"
          />
        ))}
      </div>
    </section>
  )
}
