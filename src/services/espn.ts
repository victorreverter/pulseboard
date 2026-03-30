import type {
  EspnScoreboardResponse,
  EspnTeamsResponse,
  EspnInjuriesResponse,
  EspnOddsResponse,
} from "../types/espn"

const SITE_BASE = "/api/espn/apis/site/v2/sports/basketball/nba"
const CORE_BASE = "/api/core-espn/v2/sports/basketball/leagues/nba"

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)
  return res.json()
}

export function getScoreboard(date?: string): Promise<EspnScoreboardResponse> {
  const params = date ? `?dates=${date}` : ""
  return fetchJson(`${SITE_BASE}/scoreboard${params}`)
}

export function getTeams(): Promise<EspnTeamsResponse> {
  return fetchJson(`${SITE_BASE}/teams`)
}

export function getInjuries(): Promise<EspnInjuriesResponse> {
  return fetchJson(`${SITE_BASE}/injuries`)
}

export function getOdds(
  eventId: string,
  competitionId: string
): Promise<EspnOddsResponse> {
  return fetchJson(
    `${CORE_BASE}/events/${eventId}/competitions/${competitionId}/odds/100?lang=en&region=us`
  )
}

export function getSchedule(date?: string): Promise<EspnScoreboardResponse> {
  const params = date ? `?dates=${date}` : ""
  return fetchJson(`${SITE_BASE}/scoreboard${params}`)
}

export function formatDateParam(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}${m}${d}`
}

export function todayParam(): string {
  return formatDateParam(new Date())
}

export function isLive(event: { status: { type: { state: string } } }): boolean {
  return event.status?.type?.state === "in"
}

export function isFinal(event: { status: { type: { completed: boolean } } }): boolean {
  return event.status?.type?.completed === true
}

export function isScheduled(event: { status: { type: { state: string } } }): boolean {
  return event.status?.type?.state === "pre"
}
