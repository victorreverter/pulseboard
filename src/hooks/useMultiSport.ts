import { useState, useEffect } from "react"
import { SPORTS } from "../config/sports"
import { getScoreboard, isLive, isFinal } from "../services/espn"
import { todayParam } from "../lib/dates"
import type { EspnEvent } from "../types/espn"

export interface SportEvent {
  event: EspnEvent
  sportId: string
  sportName: string
  sportIcon: string
  slug: string
}

export interface MultiSportData {
  live: SportEvent[]
  upcoming: SportEvent[]
  final: SportEvent[]
  byLeague: Map<string, { sport: typeof SPORTS[0]; events: SportEvent[] }>
  total: number
}

type State =
  | { status: "loading" }
  | { status: "success"; data: MultiSportData }
  | { status: "error"; error: string }

export function useMultiSport() {
  const [state, setState] = useState<State>({ status: "loading" })

  useEffect(() => {
    let cancelled = false

    async function fetchAll() {
      const date = todayParam()

      const results = await Promise.allSettled(
        SPORTS.map(async (sport) => {
          const data = await getScoreboard(sport.slug, date)
          return {
            sport,
            events: data.events,
          }
        })
      )

      if (cancelled) return

      const live: SportEvent[] = []
      const upcoming: SportEvent[] = []
      const finalGames: SportEvent[] = []
      const byLeague = new Map<string, { sport: typeof SPORTS[0]; events: SportEvent[] }>()

      for (const result of results) {
        if (result.status !== "fulfilled") continue
        const { sport, events } = result.value

        const sportEvents: SportEvent[] = []

        for (const event of events) {
          const se: SportEvent = {
            event,
            sportId: sport.id,
            sportName: sport.name,
            sportIcon: sport.icon,
            slug: sport.slug,
          }

          if (isLive(event)) live.push(se)
          else if (isFinal(event)) finalGames.push(se)
          else upcoming.push(se)

          sportEvents.push(se)
        }

        if (sportEvents.length > 0) {
          byLeague.set(sport.id, { sport, events: sportEvents })
        }
      }

      setState({
        status: "success",
        data: {
          live,
          upcoming,
          final: finalGames,
          byLeague,
          total: live.length + upcoming.length + finalGames.length,
        },
      })
    }

    fetchAll()

    const id = setInterval(fetchAll, 60_000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return state
}
