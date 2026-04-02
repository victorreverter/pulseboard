import { useState, useEffect } from "react"
import type { EspnTeam } from "../types/espn"
import { hexToRgba } from "../lib/utils"
import { formatGameDateLabel } from "../lib/dates"
import { isScheduled } from "../services/espn"
import { siteUrl } from "../services/espn"
import Modal from "./Modal"
import Spinner from "./Spinner"

interface TeamScheduleEvent {
  id: string
  date: string
  name: string
  shortName: string
  competitions: {
    competitors: {
      homeAway: "home" | "away"
      score: string
      winner: boolean
      team: { abbreviation: string; displayName: string; color: string }
    }[]
    venue?: { fullName: string }
  }[]
  status: { type: { completed: boolean; state: string; description: string } }
}

interface TeamScheduleResponse {
  team: {
    recordSummary: string
    seasonSummary: string
    standingSummary: string
    color: string
    abbreviation: string
  }
  events: TeamScheduleEvent[]
}

interface TeamStatsResponse {
  results: {
    stats: {
      categories: {
        name: string
        displayName: string
        stats: { name: string; displayName: string; displayValue: string }[]
      }[]
    }
  }
}

interface Props {
  team: EspnTeam
  sportSlug: string
  onClose: () => void
}

async function fetchTeamSchedule(sportSlug: string, teamId: string): Promise<TeamScheduleResponse> {
  const res = await fetch(siteUrl(sportSlug, `/teams/${teamId}/schedule`))
  if (!res.ok) throw new Error("Failed to load schedule")
  return res.json()
}

async function fetchTeamStats(sportSlug: string, teamId: string): Promise<TeamStatsResponse> {
  const res = await fetch(siteUrl(sportSlug, `/teams/${teamId}/statistics`))
  if (!res.ok) throw new Error("Failed to load stats")
  return res.json()
}

function RecentResult({ event, teamAbbr }: { event: TeamScheduleEvent; teamAbbr: string }) {
  const comp = event.competitions[0]
  const team = comp.competitors.find((c) => c.team.abbreviation === teamAbbr)
  const opp = comp.competitors.find((c) => c.team.abbreviation !== teamAbbr)
  if (!team || !opp) return null

  const won = team.winner
  const lost = opp.winner
  const isUpcoming = isScheduled(event)
  const oppColor = (opp.team as { color?: string }).color ?? "666666"
  const oppLogo = (opp.team as { logos?: { href: string; rel: string[] }[] }).logos?.[0]?.href

  return (
    <div className="flex items-center gap-3 py-2">
      <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
        isUpcoming ? "bg-border/30 text-text-muted" :
        won ? "bg-green-500/15 text-green-400" :
        lost ? "bg-red-500/15 text-red-400" :
        "bg-yellow-500/15 text-yellow-400"
      }`}>
        {isUpcoming ? "—" : won ? "W" : lost ? "L" : "T"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-text-muted">{team.homeAway === "home" ? "vs" : "@"}</span>
          <div
            className="w-5 h-5 rounded flex items-center justify-center shrink-0"
            style={{ background: hexToRgba(oppColor, 0.15) }}
          >
            {oppLogo ? (
              <img src={oppLogo} alt={opp.team.abbreviation} className="w-3.5 h-3.5 object-contain" loading="lazy" />
            ) : (
              <span className="text-[8px] font-bold" style={{ color: `#${oppColor}` }}>{opp.team.abbreviation}</span>
            )}
          </div>
        </div>
      </div>
      <span className="text-xs font-mono text-text-muted">
        {isUpcoming
          ? formatGameDateLabel(event.date)
          : `${team.score}-${opp.score}`
        }
      </span>
    </div>
  )
}

type DetailState =
  | { status: "loading" }
  | { status: "success"; schedule: TeamScheduleResponse; stats: TeamStatsResponse | null }
  | { status: "error" }

export default function TeamDetail({ team, sportSlug, onClose }: Props) {
  const [state, setState] = useState<DetailState>({ status: "loading" })

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      setState({ status: "loading" })
      try {
        const [sched, st] = await Promise.all([
          fetchTeamSchedule(sportSlug, team.id),
          fetchTeamStats(sportSlug, team.id).catch(() => null),
        ])
        if (!cancelled) setState({ status: "success", schedule: sched, stats: st })
      } catch {
        if (!cancelled) setState({ status: "error" })
      }
    }

    fetchData()

    return () => { cancelled = true }
  }, [sportSlug, team.id])

  const logo = team.logos?.find((l) => l.rel.includes("default"))?.href
  const schedule = state.status === "success" ? state.schedule : null
  const stats = state.status === "success" ? state.stats : null
  const loading = state.status === "loading"
  const recentGames = schedule?.events.slice(-10) ?? []

  return (
    <Modal
      onClose={onClose}
      title={
        <>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: hexToRgba(team.color, 0.15) }}
          >
            {logo ? (
              <img src={logo} alt={team.displayName} className="w-7 h-7 object-contain" loading="lazy" />
            ) : (
              <span className="text-sm font-bold" style={{ color: `#${team.color}` }}>
                {team.abbreviation}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-primary">{team.displayName}</h2>
            {schedule && (
              <p className="text-[10px] text-text-muted">{schedule.team.standingSummary || schedule.team.recordSummary}</p>
            )}
          </div>
        </>
      }
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-court-light/50">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: hexToRgba(team.color, 0.15) }}
            >
              {logo ? (
                <img src={logo} alt={team.displayName} className="w-12 h-12 object-contain" loading="lazy" />
              ) : (
                <span className="text-xl font-bold" style={{ color: `#${team.color}` }}>
                  {team.abbreviation}
                </span>
              )}
            </div>
            <div>
              <p className="text-lg font-bold text-text-primary">{team.displayName}</p>
              <p className="text-xs text-text-secondary">{team.location}</p>
              {schedule && (
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] font-medium text-accent">{schedule.team.recordSummary}</span>
                  <span className="text-[10px] text-text-muted">{schedule.team.seasonSummary}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-[10px] text-text-muted uppercase tracking-wider mb-2">
              Recent Results & Schedule
            </h3>
            <div className="bg-court-light/50 rounded-xl px-4 divide-y divide-border/30">
              {recentGames.map((event) => (
                <RecentResult key={event.id} event={event} teamAbbr={team.abbreviation} />
              ))}
            </div>
          </div>

          {stats?.results?.stats?.categories && (
            <div>
              <h3 className="text-[10px] text-text-muted uppercase tracking-wider mb-2">
                Season Stats
              </h3>
              <div className="space-y-3">
                {stats.results.stats.categories.slice(0, 3).map((cat) => (
                  <div key={cat.name} className="bg-court-light/50 rounded-xl p-3">
                    <p className="text-[10px] text-text-muted uppercase mb-2">{cat.displayName}</p>
                    <div className="grid grid-cols-3 gap-2">
                      {cat.stats.slice(0, 6).map((stat) => (
                        <div key={stat.name} className="text-center">
                          <p className="text-sm font-mono font-bold text-text-primary">{stat.displayValue}</p>
                          <p className="text-[10px] text-text-muted truncate">{stat.displayName}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Modal>
  )
}
