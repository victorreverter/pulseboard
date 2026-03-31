import { useState, useEffect, useMemo } from "react"
import type { SportEvent } from "../hooks/useMultiSport"
import { getSportIcon } from "../config/sports-icons"
import { hexToRgba } from "../lib/utils"

interface Props {
  upcoming: SportEvent[]
  live: SportEvent[]
}

function formatCountdown(diffMs: number): string {
  if (diffMs <= 0) return "Now"

  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    const h = hours % 24
    return `${days}d ${h}h`
  }
  if (hours > 0) {
    const m = minutes % 60
    return `${hours}h ${m}m`
  }
  if (minutes > 0) {
    return `${minutes}m`
  }
  return `${seconds}s`
}

function formatGameTime(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function formatGameDate(dateStr: string): string {
  const d = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(d)
  target.setHours(0, 0, 0, 0)

  const diffDays = Math.round((target.getTime() - today.getTime()) / 86400000)

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Tomorrow"
  if (diffDays === -1) return "Yesterday"

  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
}

export default function NextEventsCountdown({ upcoming, live }: Props) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const nextEvents = useMemo(() => {
    return upcoming
      .sort((a, b) => new Date(a.event.date).getTime() - new Date(b.event.date).getTime())
      .slice(0, 10)
  }, [upcoming])

  if (nextEvents.length === 0) return null

  const nextEvent = nextEvents[0]
  const nextDate = new Date(nextEvent.event.date).getTime()
  const diff = nextDate - now

  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
          Next Up
        </h2>
        {live.length > 0 && (
          <span className="text-[10px] text-text-muted">
            {live.length} live now
          </span>
        )}
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-accent/5 border-b border-border">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: hexToRgba(nextEvent.sportIcon === "basketball" ? "c8102e" : nextEvent.sportIcon === "football" ? "003069" : nextEvent.sportIcon === "baseball" ? "002d72" : nextEvent.sportIcon === "hockey" ? "a2aaad" : "3a86ff", 0.15) }}
            >
              <span className="w-4 h-4 text-accent">{getSportIcon(nextEvent.sportIcon)}</span>
            </div>
            <div>
              <p className="text-xs text-text-muted">{nextEvent.sportName}</p>
              <p className="text-sm font-semibold text-text-primary">
                {nextEvent.event.shortName}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-mono font-bold text-accent tabular-nums">
              {diff <= 0 ? "Now" : formatCountdown(diff)}
            </p>
            <p className="text-[10px] text-text-muted">
              {formatGameDate(nextEvent.event.date)} · {formatGameTime(nextEvent.event.date)}
            </p>
          </div>
        </div>

        <div className="divide-y divide-border/50">
          {nextEvents.slice(1).map((se) => {
            const eventDate = new Date(se.event.date).getTime()
            const eventDiff = eventDate - now
            const comp = se.event.competitions?.[0]
            const away = comp?.competitors?.find((c) => c.homeAway === "away")
            const home = comp?.competitors?.find((c) => c.homeAway === "home")

            return (
              <div key={se.event.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-surface-hover transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-3.5 h-3.5 text-text-muted shrink-0">{getSportIcon(se.sportIcon)}</span>
                  <div className="flex items-center gap-2 min-w-0">
                    {away && home ? (
                      <>
                        <span className="text-xs text-text-primary truncate">{away.team.abbreviation}</span>
                        <span className="text-[10px] text-text-muted">@</span>
                        <span className="text-xs text-text-primary truncate">{home.team.abbreviation}</span>
                      </>
                    ) : (
                      <span className="text-xs text-text-primary truncate">{se.event.shortName}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] text-text-muted">
                    {formatGameDate(se.event.date)}
                  </span>
                  <span className="text-xs font-mono text-text-secondary tabular-nums min-w-[60px] text-right">
                    {formatCountdown(eventDiff)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {nextEvents.length > 1 && (
          <div className="px-4 py-2 bg-court-light/30 text-center">
            <span className="text-[10px] text-text-muted">
              {upcoming.length} upcoming {upcoming.length === 1 ? "event" : "events"} across all sports
            </span>
          </div>
        )}
      </div>
    </section>
  )
}
