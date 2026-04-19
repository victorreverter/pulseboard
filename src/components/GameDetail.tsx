import type { EspnEvent, EspnCompetitor, EspnStat, EspnLeaderCategory, EspnLineScore } from "../types/espn"
import { hexToRgba, getTeamLogo, getPlayerHeadshot } from "../lib/utils"
import { periodLabels, periodShortLabel } from "../lib/periods"
import { isLive, isFinal } from "../services/espn"
import Modal from "./Modal"
import OddsPanel from "./OddsPanel"

interface Props {
  event: EspnEvent
  sportSlug: string
  onClose: () => void
}

function StatRow({ label, away, home, awayColor, homeColor }: { label: string; away: string; home: string; awayColor: string; homeColor: string }) {
  const aNum = parseFloat(away) || 0
  const hNum = parseFloat(home) || 0
  const total = aNum + hNum
  const aPct = total > 0 ? (aNum / total) * 100 : 50
  const hPct = total > 0 ? (hNum / total) * 100 : 50

  return (
    <div className="py-2 hover:bg-white/5 rounded-lg px-2 transition-colors">
      <div className="flex justify-between items-end mb-1.5">
        <span className={`text-xs font-mono font-bold ${aNum > hNum ? "text-text-primary drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" : "text-text-muted opacity-70"}`}>
          {away}
        </span>
        <span className="text-[10px] text-text-muted uppercase tracking-wider">{label}</span>
        <span className={`text-xs font-mono font-bold ${hNum > aNum ? "text-text-primary drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" : "text-text-muted opacity-70"}`}>
          {home}
        </span>
      </div>
      <div className="flex h-1.5 rounded-full overflow-hidden bg-black/50 border border-white/5">
        <div className="transition-all duration-700 h-full" style={{ width: `${aPct}%`, backgroundColor: `#${awayColor}`, boxShadow: aNum > hNum ? `0 0 8px #${awayColor}` : 'none' }} />
        <div className="transition-all duration-700 h-full" style={{ width: `${hPct}%`, backgroundColor: `#${homeColor}`, boxShadow: hNum > aNum ? `0 0 8px #${homeColor}` : 'none' }} />
      </div>
    </div>
  )
}

function CompetitorHeader({ comp, side, sportSlug }: { comp: EspnCompetitor; side: "away" | "home"; sportSlug: string }) {
  const logo = getTeamLogo(comp.team, sportSlug);
  const align = side === "away" ? "text-left" : "text-right"

  return (
    <div className={`flex items-center gap-3 ${side === "away" ? "" : "flex-row-reverse"}`}>
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: hexToRgba(comp.team.color, 0.15) }}
      >
        <img src={logo} alt={comp.team.abbreviation} className="w-9 h-9 object-contain drop-shadow-md" loading="lazy" />
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

function LeaderCategory({ cat, teamColor, sportSlug }: { cat: EspnLeaderCategory; teamColor?: string; sportSlug: string }) {
  const leader = cat.leaders?.[0]
  if (!leader) return null

  const headshot = getPlayerHeadshot(leader.athlete, sportSlug)

  return (
    <div className="bg-surface/40 p-3 flex flex-col justify-center rounded-xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
      <div className="absolute inset-0 opacity-10 blur-xl transition-opacity group-hover:opacity-20" style={{ backgroundColor: teamColor ? `#${teamColor}` : 'transparent' }} />
      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2 relative z-10">{cat.displayName}</p>
      <div className="flex items-center gap-3 relative z-10">
        <div className="relative w-10 h-10 rounded-full bg-white/10 shrink-0 overflow-hidden border-2 border-white/10 drop-shadow-md">
          {headshot && (
            <img
              src={headshot}
              alt={leader.athlete.fullName}
              className="absolute inset-0 w-full h-full object-cover bg-surface/50"
              loading="lazy"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-text-primary truncate">{leader.athlete.shortName || leader.athlete.fullName}</p>
        </div>
        <span className="text-xl font-display font-bold text-text-primary tabular-nums drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]">
          {leader.displayValue}
        </span>
      </div>
    </div>
  )
}

export default function GameDetail({ event, sportSlug, onClose }: Props) {
  const comp = event.competitions?.[0]
  if (!comp) return null

  const home = comp.competitors.find((c: EspnCompetitor) => c.homeAway === "home")
  const away = comp.competitors.find((c: EspnCompetitor) => c.homeAway === "away")
  if (!home || !away) return null

  const homeStats = Object.fromEntries(
    (home.statistics ?? []).map((s: EspnStat) => [s.name, s.displayValue])
  )
  const awayStats = Object.fromEntries(
    (away.statistics ?? []).map((s: EspnStat) => [s.name, s.displayValue])
  )

  const statsToShow = availableStats(comp.competitors, event.uid)
  const lineCount = Math.max(away.linescores?.length ?? 0, home.linescores?.length ?? 0)
  const labels = periodLabels(lineCount, event.uid)

  const hasCompLeaders = comp.leaders && comp.leaders.length > 0
  const hasTeamLeaders = comp.competitors.some((c: EspnCompetitor) => c.leaders?.length > 0)

  const uniqueCompLeaders = hasCompLeaders
    ? (() => {
        const seen = new Set<string>()
        return comp.leaders!.filter((cat: EspnLeaderCategory) => {
          if (seen.has(cat.displayName)) return false
          seen.add(cat.displayName)
          return true
        })
      })()
    : []

  return (
    <Modal
      onClose={onClose}
      title={
        <>
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
        </>
      }
    >
      <div className="flex items-center justify-between mb-6">
        <CompetitorHeader comp={away} side="away" sportSlug={sportSlug} />
        <div className="text-center px-4">
          <div className="flex items-baseline gap-4">
            <span className="text-5xl font-display font-bold text-text-primary tabular-nums">
              {away.score}
            </span>
            <span className="text-2xl font-display text-text-muted opacity-50">:</span>
            <span className="text-5xl font-display font-bold text-text-primary tabular-nums">
              {home.score}
            </span>
          </div>
          {comp.venue && (
            <p className="text-[10px] text-text-muted mt-1">
              {comp.venue.fullName}
            </p>
          )}
        </div>
        <CompetitorHeader comp={home} side="home" sportSlug={sportSlug} />
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
              <div className="flex justify-end">
                <div
                  className="w-5 h-5 rounded flex items-center justify-center"
                  style={{ background: hexToRgba(away.team.color, 0.15) }}
                >
                  {away.team.logos?.[0] ? (
                    <img src={away.team.logos[0].href} alt={away.team.abbreviation} className="w-3.5 h-3.5 object-contain" loading="lazy" />
                  ) : (
                    <span className="text-[8px] font-bold" style={{ color: `#${away.team.color}` }}>{away.team.abbreviation}</span>
                  )}
                </div>
              </div>
              {away.linescores?.map((ls: EspnLineScore) => (
                <span key={ls.period} className="font-mono text-text-primary">{ls.displayValue}</span>
              ))}
              <span className="font-mono font-bold text-text-primary">{away.score}</span>
            </div>
            <div
              className="grid gap-2 text-xs text-center mt-1"
              style={{ gridTemplateColumns: `auto repeat(${lineCount}, 1fr) auto` }}
            >
              <div className="flex justify-end">
                <div
                  className="w-5 h-5 rounded flex items-center justify-center"
                  style={{ background: hexToRgba(home.team.color, 0.15) }}
                >
                  <img src={getTeamLogo(home.team, sportSlug)} alt={home.team.abbreviation} className="w-3.5 h-3.5 object-contain" loading="lazy" />
                </div>
              </div>
              {home.linescores?.map((ls: EspnLineScore) => (
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
            <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center mb-2 px-1">
              <div className="flex justify-end">
                <div
                  className="w-5 h-5 rounded flex items-center justify-center"
                  style={{ background: hexToRgba(away.team.color, 0.15) }}
                >
                  {away.team.logos?.[0] ? (
                    <img src={away.team.logos[0].href} alt={away.team.abbreviation} className="w-3.5 h-3.5 object-contain" loading="lazy" />
                  ) : (
                    <span className="text-[8px] font-bold" style={{ color: `#${away.team.color}` }}>{away.team.abbreviation}</span>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-text-muted uppercase tracking-wider text-center w-20">Stat</span>
              <div className="flex justify-start">
                <div
                  className="w-5 h-5 rounded flex items-center justify-center"
                  style={{ background: hexToRgba(home.team.color, 0.15) }}
                >
                  <img src={getTeamLogo(home.team, sportSlug)} alt={home.team.abbreviation} className="w-3.5 h-3.5 object-contain" loading="lazy" />
                </div>
              </div>
            </div>
            {statsToShow.map(({ key, label }) => (
              <StatRow
                key={key}
                label={label}
                away={awayStats[key] ?? "—"}
                home={homeStats[key] ?? "—"}
                awayColor={away.team.color}
                homeColor={home.team.color}
              />
            ))}
          </div>
        </div>
      )}

      {hasCompLeaders && (
        <div className="mt-6">
          <h3 className="text-[10px] text-text-muted uppercase tracking-wider mb-2 text-center">
            Leaders
          </h3>
          <div className="bg-court-light/50 rounded-xl p-3 space-y-3">
            {uniqueCompLeaders.map((cat: EspnLeaderCategory) => (
              <LeaderCategory key={cat.name} cat={cat} sportSlug={sportSlug} />
            ))}
          </div>
        </div>
      )}

      {hasTeamLeaders && !hasCompLeaders && (
        <div className="mt-6">
          <h3 className="text-[10px] text-text-muted uppercase tracking-wider mb-2 text-center">
            Leaders
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[away, home].map((comp) => {
              const seen = new Set<string>()
              const uniqueLeaders = (comp.leaders ?? []).filter((cat: EspnLeaderCategory) => {
                if (seen.has(cat.displayName)) return false
                seen.add(cat.displayName)
                return true
              })

              return (
                <div key={comp.id} className="bg-court-light/50 rounded-xl p-3">
                  <div className="flex justify-center mb-2">
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ background: hexToRgba(comp.team.color, 0.15) }}
                    >
                      <img src={getTeamLogo(comp.team, sportSlug)} alt={comp.team.abbreviation} className="w-4 h-4 object-contain" loading="lazy" />
                    </div>
                  </div>
                  {uniqueLeaders.map((cat: EspnLeaderCategory) => (
                    <LeaderCategory key={cat.name} cat={cat} teamColor={comp.team.color} sportSlug={sportSlug} />
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
    </Modal>
  )
}
