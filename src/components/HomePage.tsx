import { useMemo } from "react"
import type { EspnEvent } from "../types/espn"
import type { SportEvent } from "../hooks/useMultiSport"
import { SPORTS } from "../config/sports"
import LiveSection from "./LiveSection"
import NextEventsCountdown from "./NextEventsCountdown"
import SportGroup from "./SportGroup"
import Spinner from "./Spinner"

interface Props {
  state: {
    status: string
    data?: {
      live: SportEvent[]
      upcoming: SportEvent[]
      final: SportEvent[]
      byLeague: Map<string, { sport: typeof SPORTS[0]; events: SportEvent[] }>
      total: number
    }
    error?: string
  }
  onGameClick?: (event: EspnEvent) => void
  onSeeAll?: (sportId: string) => void
}

export default function HomePage({ state, onGameClick, onSeeAll }: Props) {
  const { live, upcoming, finalGames, total } = useMemo(() => {
    if (state.status !== "success" || !state.data) {
      return { live: [], upcoming: [], finalGames: [], total: 0 }
    }
    return {
      live: state.data.live,
      upcoming: state.data.upcoming,
      finalGames: state.data.final,
      total: state.data.total,
    }
  }, [state])

  const sortedLeagues = useMemo(() => {
    if (state.status !== "success" || !state.data) return []
    const leagues = [...state.data.byLeague.values()]
    leagues.sort((a, b) => a.sport.priority - b.sport.priority)
    return leagues
  }, [state])

  const liveByLeague = useMemo(() => {
    const map = new Map<string, SportEvent[]>()
    for (const se of live) {
      const arr = map.get(se.sportId) ?? []
      arr.push(se)
      map.set(se.sportId, arr)
    }
    return map
  }, [live])

  const upcomingByLeague = useMemo(() => {
    const map = new Map<string, SportEvent[]>()
    for (const se of upcoming) {
      const arr = map.get(se.sportId) ?? []
      arr.push(se)
      map.set(se.sportId, arr)
    }
    return map
  }, [upcoming])

  const finalByLeague = useMemo(() => {
    const map = new Map<string, SportEvent[]>()
    for (const se of finalGames) {
      const arr = map.get(se.sportId) ?? []
      arr.push(se)
      map.set(se.sportId, arr)
    }
    return map
  }, [finalGames])

  if (state.status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner />
      </div>
    )
  }

  if (state.status === "error") {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-text-muted text-sm">Failed to load scores</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <LiveSection events={live} onGameClick={onGameClick} />

      <NextEventsCountdown upcoming={upcoming} live={live} />

      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            Coming Events
          </h2>
        </div>

        {sortedLeagues.map(({ sport }) => {
          const leagueLive = liveByLeague.get(sport.id) ?? []
          const leagueUpcoming = upcomingByLeague.get(sport.id) ?? []
          const leagueFinal = finalByLeague.get(sport.id) ?? []

          const allEvents = [...leagueLive, ...leagueUpcoming, ...leagueFinal]
          if (allEvents.length === 0) return null

          return (
            <SportGroup
              key={sport.id}
              sport={sport}
              events={allEvents}
              onGameClick={onGameClick}
              onSeeAll={onSeeAll}
              limit={5}
            />
          )
        })}
      </div>

      {total === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <svg className="w-12 h-12 text-text-muted mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-text-secondary text-sm font-medium">No games today</p>
          <p className="text-text-muted text-xs mt-1">Check back tomorrow</p>
        </div>
      )}
    </div>
  )
}
