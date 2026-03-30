import { useState, useMemo } from "react"
import type { EspnEvent } from "../types/espn"
import { isLive, isFinal, isScheduled } from "../services/espn"
import GameCard from "./GameCard"
import Card from "./Card"

interface Props {
  events: EspnEvent[]
  onGameClick?: (event: EspnEvent) => void
}

type Filter = "all" | "live" | "final" | "upcoming"

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "live", label: "Live" },
  { key: "final", label: "Final" },
  { key: "upcoming", label: "Upcoming" },
]

export default function Scoreboard({ events, onGameClick }: Props) {
  const [filter, setFilter] = useState<Filter>("all")

  const filtered = useMemo(() => {
    switch (filter) {
      case "live":
        return events.filter(isLive)
      case "final":
        return events.filter(isFinal)
      case "upcoming":
        return events.filter(isScheduled)
      default:
        return events
    }
  }, [events, filter])

  const liveCount = events.filter(isLive).length

  return (
    <Card
      title="Scoreboard"
      subtitle={liveCount > 0 ? `${liveCount} live now` : `${events.length} games`}
      icon={
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      }
    >
      <div className="flex gap-1 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              filter === f.key
                ? "bg-accent text-white"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
            }`}
          >
            {f.label}
            {f.key === "live" && liveCount > 0 && (
              <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-live inline-block animate-pulse" />
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-6">No games found</p>
        ) : (
          filtered.map((event) => (
            <GameCard key={event.id} event={event} onClick={onGameClick} />
          ))
        )}
      </div>
    </Card>
  )
}
