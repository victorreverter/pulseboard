import { useState, useMemo } from "react"
import type { EspnEvent } from "../types/espn"
import { isLive, isFinal, isScheduled, formatDateParam } from "../services/espn"
import GameCard from "./GameCard"
import Card from "./Card"

interface Props {
  events: EspnEvent[]
  date: string
  onDateChange: (date: string) => void
  onGameClick?: (event: EspnEvent) => void
}

type Filter = "all" | "live" | "final" | "upcoming"

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "live", label: "Live" },
  { key: "final", label: "Final" },
  { key: "upcoming", label: "Upcoming" },
]

function formatDisplayDate(dateStr: string): string {
  const y = parseInt(dateStr.slice(0, 4))
  const m = parseInt(dateStr.slice(4, 6)) - 1
  const d = parseInt(dateStr.slice(6, 8))
  const date = new Date(y, m, d)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(y, m, d)

  const diff = target.getTime() - today.getTime()
  const dayMs = 86400000

  if (diff === 0) return "Today"
  if (diff === dayMs) return "Tomorrow"
  if (diff === -dayMs) return "Yesterday"

  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
}

function shiftDate(dateStr: string, days: number): string {
  const y = parseInt(dateStr.slice(0, 4))
  const m = parseInt(dateStr.slice(4, 6)) - 1
  const d = parseInt(dateStr.slice(6, 8))
  const date = new Date(y, m, d + days)
  return formatDateParam(date)
}

export default function Scoreboard({ events, date, onDateChange, onGameClick }: Props) {
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">
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
        <div className="flex items-center gap-1">
          <button
            onClick={() => onDateChange(shiftDate(date, -1))}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-xs font-medium text-text-primary min-w-[100px] text-center">
            {formatDisplayDate(date)}
          </span>
          <button
            onClick={() => onDateChange(shiftDate(date, 1))}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
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
