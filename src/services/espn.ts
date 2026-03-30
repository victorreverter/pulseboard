import type {
  EspnScoreboardResponse,
  EspnTeamsResponse,
  EspnInjuriesResponse,
  EspnOddsResponse,
} from "../types/espn"

const isDev = import.meta.env.DEV

function siteUrl(sportSlug: string, path: string): string {
  const base = isDev
    ? `/api/espn/apis/site/v2/sports`
    : "https://site.api.espn.com/apis/site/v2/sports"
  return `${base}/${sportSlug}${path}`
}

function coreUrl(sportSlug: string, path: string): string {
  const base = isDev
    ? "/api/core-espn/v2/sports"
    : "https://sports.core.api.espn.com/v2/sports"

  const [sport, league] = sportSlug.split("/")
  return `${base}/${sport}/leagues/${league}${path}`
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)
  return res.json()
}

export function getScoreboard(
  sportSlug: string,
  date?: string
): Promise<EspnScoreboardResponse> {
  const params = date ? `?dates=${date}` : ""
  return fetchJson(siteUrl(sportSlug, `/scoreboard${params}`))
}

export function getTeams(sportSlug: string): Promise<EspnTeamsResponse> {
  return fetchJson(siteUrl(sportSlug, "/teams"))
}

export function getInjuries(sportSlug: string): Promise<EspnInjuriesResponse> {
  return fetchJson(siteUrl(sportSlug, "/injuries"))
}

export function getOdds(
  sportSlug: string,
  eventId: string,
  competitionId: string
): Promise<EspnOddsResponse> {
  return fetchJson(
    coreUrl(
      sportSlug,
      `/events/${eventId}/competitions/${competitionId}/odds/100?lang=en&region=us`
    )
  )
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
