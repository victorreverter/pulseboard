import type { EspnEvent, EspnCompetitor } from "../types/espn"
import { hexToRgba } from "../lib/utils"
import { isLive, isFinal } from "../services/espn"
import OddsPanel from "./OddsPanel"

interface Props {
  event: EspnEvent
  sportSlug: string
  onClose: () => void
}

function periodLabels(count: number, uid: string): string[] {
  if (uid.includes("soccer")) {
    const labels = ["1H", "2H"]
    for (let i = 3; i <= count; i++) labels.push(`ET${i - 2}`)
    return labels.slice(0, count)
  }
  if (uid.includes("hockey")) {
    const labels = ["P1", "P2", "P3"]
    for (let i = 4; i <= count; i++) labels.push(`OT${i - 3}`)
    return labels.slice(0, count)
  }
  const labels = ["Q1", "Q2", "Q3", "Q4"]
  for (let i = 5; i <= count; i++) labels.push(`OT${i - 4}`)
  return labels.slice(0, count)
}

function periodShortLabel(period: number, uid: string): string {
  if (uid.includes("soccer")) {
    return period === 1 ? "1H" : period === 2 ? "2H" : `ET${period - 2}`
  }
  if (uid.includes("hockey")) {
    return period <= 3 ? `P${period}` : `OT${period - 3}`
  }
  return period <= 4 ? `Q${period}` : `OT${period - 4}`
}

function StatRow({ label, away, home }: { label: string; away: string; home: string }) {
  const aNum = parseFloat(away) || 0
  const hNum = parseFloat(home) || 0

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-1.5 text-xs">
      <div className="text-right">
        <span className={`font-mono ${aNum > hNum ? "text-text-primary font-semibold" : "text-text-muted"}`}>
          {away}
        </span>
      </div>
      <span className="text-text-muted text-[10px] uppercase tracking-wider w-20 text-center truncate">
        {label}
      </span>
      <div className="text-left">
        <span className={`font-mono ${hNum > aNum ? "text-text-primary font-semibold" : "text-text-muted"}`}>
          {home}
        </span>
      </div>
    </div>
  )
}

function CompetitorHeader({ comp, side }: { comp: EspnCompetitor; side: "away" | "home" }) {
  const logo = comp.team.logos?.find((l) => l.rel.includes("scoreboard"))?.href ?? comp.team.logos?.[0]?.href
  const align = side === "away" ? "text-left" : "text-right"

  return (
    <div className={`flex items-center gap-3 ${side === "away" ? "" : "flex-row-reverse"}`}>
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: hexToRgba(comp.team.color, 0.15) }}
      >
        {logo ? (
          <img src={logo} alt={comp.team.abbreviation} className="w-9 h-9 object-contain" />
        ) : (
          <span className="text-lg font-bold" style={{ color: `#${comp.team.color}` }}>
            {comp.team.abbreviation}
          </span>
        )}
      </div>
      <div className={align}>
        <p className="text-sm font-semibold text-text-primary">{comp.team.displayName}</p>
        {comp.records?.[0] && (
          <p className="text-[10px] text-text-muted">{comp.records[0].summary}</p>
        )}
      </div>
    </div>
  )
}

function availableStats(competitors: EspnCompetitor[], uid: string): { key: string; label: string }[] {
  const statNames = new Set<string>()
  for (const c of competitors) {
    for (const s of c.statistics ?? []) {
      statNames.add(s.name)
    }
  }

  const statMap: Record<string, { key: string; label: string }[]> = {
    soccer: [
      { key: "totalGoals", label: "Goals" },
      { key: "totalShots", label: "Shots" },
      { key: "shotsOnTarget", label: "On Target" },
      { key: "possessionPct", label: "Possession" },
      { key: "foulsCommitted", label: "Fouls" },
      { key: "wonCorners", label: "Corners" },
      { key: "goalAssists", label: "Assists" },
      { key: "shotAssists", label: "Key Passes" },
      { key: "saves", label: "Saves" },
    ],
    hockey: [
      { key: "goals", label: "Goals" },
      { key: "assists", label: "Assists" },
      { key: "points", label: "Points" },
      { key: "saves", label: "Saves" },
      { key: "savePct", label: "Save %" },
      { key: "ytdGoals", label: "Season Goals" },
    ],
    baseball: [
      { key: "runs", label: "Runs" },
      { key: "hits", label: "Hits" },
      { key: "errors", label: "Errors" },
      { key: "avg", label: "AVG" },
      { key: "ERA", label: "ERA" },
      { key: "wins", label: "Wins" },
      { key: "losses", label: "Losses" },
      { key: "saves", label: "Saves" },
    ],
    football: [
      { key: "rushingYards", label: "Rush Yds" },
      { key: "passingYards", label: "Pass Yds" },
      { key: "totalYards", label: "Total Yds" },
      { key: "turnovers", label: "Turnovers" },
      { key: "possessionTime", label: "Possession" },
      { key: "firstDowns", label: "1st Downs" },
    ],
    basketball: [
      { key: "fieldGoalsMade", label: "FG" },
      { key: "fieldGoalsAttempted", label: "FGA" },
      { key: "threePointFieldGoalsMade", label: "3PT" },
      { key: "freeThrowsMade", label: "FT" },
      { key: "totalRebounds", label: "Reb" },
      { key: "assists", label: "AST" },
      { key: "steals", label: "STL" },
      { key: "blocks", label: "BLK" },
      { key: "turnovers", label: "TO" },
    ],
  }

  let sportType = "basketball"
  if (uid.includes("soccer")) sportType = "soccer"
  else if (uid.includes("hockey")) sportType = "hockey"
  else if (uid.includes("baseball")) sportType = "baseball"
  else if (uid.includes("football")) sportType = "football"

  const sportStats = statMap[sportType] ?? statMap.basketball
  const uniqueStats = new Map<string, { key: string; label: string }>()
  for (const stat of sportStats) {
    uniqueStats.set(stat.key, stat)
  }

  return [...uniqueStats.values()].filter((s) => statNames.has(s.key))
}

export default function GameDetail({ event, sportSlug, onClose }: Props) {
  const comp = event.competitions?.[0]
  if (!comp) return null

  const home = comp.competitors.find((c) => c.homeAway === "home")
  const away = comp.competitors.find((c) => c.homeAway === "away")
  if (!home || !away) return null

  const homeStats = Object.fromEntries(
    (home.statistics ?? []).map((s) => [s.name, s.displayValue])
  )
  const awayStats = Object.fromEntries(
    (away.statistics ?? []).map((s) => [s.name, s.displayValue])
  )

  const statsToShow = availableStats(comp.competitors, event.uid)
  const lineCount = Math.max(away.linescores?.length ?? 0, home.linescores?.length ?? 0)
  const labels = periodLabels(lineCount, event.uid)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-surface/95 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isLive(event) && (
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-live animate-pulse" />
                <span className="text-xs font-mono text-live font-semibold">
                  {event.status.displayClock} - {periodShortLabel(event.status.period, event.uid)}
                </span>
              </span>
            )}
            {isFinal(event) && (
              <span className="text-xs font-semibold text-text-muted uppercase">Final</span>
            )}
            {event.week && (
              <span className="text-[10px] font-medium text-accent bg-accent/10 px-2 py-0.5 rounded">
                Week {event.week.number}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <CompetitorHeader comp={away} side="away" />
            <div className="text-center px-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-mono font-bold text-text-primary tabular-nums">
                  {away.score}
                </span>
                <span className="text-lg text-text-muted">:</span>
                <span className="text-3xl font-mono font-bold text-text-primary tabular-nums">
                  {home.score}
                </span>
              </div>
              {comp.venue && (
                <p className="text-[10px] text-text-muted mt-1">
                  {comp.venue.fullName}
                </p>
              )}
            </div>
            <CompetitorHeader comp={home} side="home" />
          </div>

          {lineCount > 0 && (
            <div className="mb-6">
              <h3 className="text-[10px] text-text-muted uppercase tracking-wider mb-2 text-center">
                Scoring by Period
              </h3>
              <div className="bg-court-light/50 rounded-xl p-3">
                <div
                  className="grid gap-2 text-[10px] text-text-muted text-center mb-1"
                  style={{ gridTemplateColumns: `auto repeat(${lineCount}, 1fr) auto` }}
                >
                  <span />
                  {labels.map((l) => (
                    <span key={l}>{l}</span>
                  ))}
                  <span className="font-semibold">T</span>
                </div>
                <div
                  className="grid gap-2 text-xs text-center"
                  style={{ gridTemplateColumns: `auto repeat(${lineCount}, 1fr) auto` }}
                >
                  <span className="text-text-secondary text-[10px]">{away.team.abbreviation}</span>
                  {away.linescores?.map((ls) => (
                    <span key={ls.period} className="font-mono text-text-primary">{ls.displayValue}</span>
                  ))}
                  <span className="font-mono font-bold text-text-primary">{away.score}</span>
                </div>
                <div
                  className="grid gap-2 text-xs text-center mt-1"
                  style={{ gridTemplateColumns: `auto repeat(${lineCount}, 1fr) auto` }}
                >
                  <span className="text-text-secondary text-[10px]">{home.team.abbreviation}</span>
                  {home.linescores?.map((ls) => (
                    <span key={ls.period} className="font-mono text-text-primary">{ls.displayValue}</span>
                  ))}
                  <span className="font-mono font-bold text-text-primary">{home.score}</span>
                </div>
              </div>
            </div>
          )}

          {statsToShow.length > 0 && (
            <div>
              <h3 className="text-[10px] text-text-muted uppercase tracking-wider mb-2 text-center">
                Stats
              </h3>
              <div className="bg-court-light/50 rounded-xl p-3">
                <div className="grid grid-cols-[1fr_auto_1fr] gap-2 text-[10px] text-text-muted uppercase tracking-wider mb-2 px-1">
                  <span className="text-right">{away.team.abbreviation}</span>
                  <span className="text-center w-20">Stat</span>
                  <span className="text-left">{home.team.abbreviation}</span>
                </div>
                {statsToShow.map(({ key, label }) => (
                  <StatRow
                    key={key}
                    label={label}
                    away={awayStats[key] ?? "—"}
                    home={homeStats[key] ?? "—"}
                  />
                ))}
              </div>
            </div>
          )}

          {comp.leaders && comp.leaders.length > 0 && (() => {
            const seen = new Set<string>()
            const uniqueLeaders = comp.leaders.filter((cat) => {
              if (seen.has(cat.displayName)) return false
              seen.add(cat.displayName)
              return true
            })

            return (
              <div className="mt-6">
                <h3 className="text-[10px] text-text-muted uppercase tracking-wider mb-2 text-center">
                  Leaders
                </h3>
                <div className="bg-court-light/50 rounded-xl p-3 space-y-3">
                  {uniqueLeaders.map((cat) => (
                    <div key={cat.name}>
                      <p className="text-[10px] text-text-muted uppercase mb-1">{cat.displayName}</p>
                      {cat.leaders?.slice(0, 1).map((leader) => (
                        <div key={leader.athlete.id} className="flex items-center gap-2">
                          {leader.athlete.headshot?.href && (
                            <img
                              src={leader.athlete.headshot.href}
                              alt={leader.athlete.fullName}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                          )}
                          <span className="text-xs font-medium text-text-primary truncate">
                            {leader.athlete.fullName}
                          </span>
                          <span className="text-xs font-mono text-accent ml-auto">
                            {leader.displayValue}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}

          {comp.competitors.some((c) => c.leaders?.length > 0) && !comp.leaders?.length && (
            <div className="mt-6">
              <h3 className="text-[10px] text-text-muted uppercase tracking-wider mb-2 text-center">
                Leaders
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[away, home].map((comp) => {
                  const seen = new Set<string>()
                  const uniqueLeaders = (comp.leaders ?? []).filter((cat) => {
                    if (seen.has(cat.displayName)) return false
                    seen.add(cat.displayName)
                    return true
                  })

                  return (
                    <div key={comp.id} className="bg-court-light/50 rounded-xl p-3">
                      <p className="text-[10px] text-text-muted uppercase mb-2 text-center">
                        {comp.team.abbreviation}
                      </p>
                      {uniqueLeaders.map((cat) => (
                        <div key={cat.name} className="mb-2 last:mb-0">
                          <p className="text-[10px] text-text-muted uppercase">{cat.displayName}</p>
                          {cat.leaders?.slice(0, 1).map((leader) => (
                            <div key={leader.athlete.id} className="flex items-center gap-2 mt-0.5">
                              {leader.athlete.headshot?.href && (
                                <img
                                  src={leader.athlete.headshot.href}
                                  alt={leader.athlete.fullName}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              )}
                              <span className="text-xs text-text-primary truncate">
                                {leader.athlete.shortName}
                              </span>
                              <span className="text-xs font-mono text-accent ml-auto">
                                {leader.displayValue}
                              </span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="mt-6">
            <OddsPanel
              sportSlug={sportSlug}
              eventId={event.id}
              competitionId={comp.id}
              homeName={home.team.displayName}
              awayName={away.team.displayName}
            />
          </div>

          {comp.headlines?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-[10px] text-text-muted uppercase tracking-wider mb-2">
                Recap
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {comp.headlines[0].description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
