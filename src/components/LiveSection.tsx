import type { EspnEvent } from "../types/espn"
import type { SportEvent } from "../hooks/useMultiSport"
import MiniGameCard from "./MiniGameCard"

interface Props {
  events: SportEvent[]
  onGameClick?: (event: EspnEvent) => void
}

export default function LiveSection({ events, onGameClick }: Props) {
  if (events.length === 0) return null

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-live animate-pulse" />
        <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
          Live Now
        </h2>
        <span className="text-[10px] font-mono text-live bg-live/10 px-2 py-0.5 rounded-full">
          {events.length}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {events.map((se) => (
          <MiniGameCard
            key={se.event.id}
            sportEvent={se}
            onClick={onGameClick}
            variant="hero"
          />
        ))}
      </div>
    </section>
  )
}
