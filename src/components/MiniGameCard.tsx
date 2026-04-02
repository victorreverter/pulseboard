import type { EspnEvent, EspnWinProbability } from "../types/espn"
import { hexToRgba } from "../lib/utils"
import { periodShortLabel } from "../lib/periods"
import { formatGameTime } from "../lib/dates"
import { isLive, isFinal } from "../services/espn"
import type { SportEvent } from "../hooks/useMultiSport"
import { getSportIcon } from "../config/sports-icons"

interface Props {
  sportEvent: SportEvent
  onClick?: (event: EspnEvent) => void
  variant?: "hero" | "compact"
}

function MiniTeamRow({
  team,
  score,
  isWinner,
  showScore,
}: {
  team: { abbreviation: string; displayName: string; color: string; logos: { href: string; rel: string[] }[] }
  score: string
  isWinner: boolean
  showScore: boolean
}) {
  const logo = team.logos?.find((l) => l.rel.includes("scoreboard"))?.href ?? team.logos?.[0]?.href

  return (
    <div className="flex items-center gap-2">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: hexToRgba(team.color, 0.15) }}
      >
        {logo ? (
          <img src={logo} alt={team.abbreviation} className="w-5 h-5 object-contain" loading="lazy" />
        ) : (
          <span className="text-[10px] font-bold" style={{ color: `#${team.color}` }}>
            {team.abbreviation}
          </span>
        )}
      </div>
      <span className={`flex-1 text-sm truncate ${isWinner ? "text-text-primary font-medium" : "text-text-secondary"}`}>
        {team.displayName}
      </span>
      {showScore && (
        <span className={`text-sm font-mono tabular-nums ${isWinner ? "text-text-primary font-bold" : "text-text-muted"}`}>
          {score}
        </span>
      )}
    </div>
  )
}

function WinProbBar({ probability }: { probability: EspnWinProbability }) {
  const home = Math.round(probability.homeWinPercentage * 100)
  const away = 100 - home

  return (
    <div className="mt-2">
      <div className="flex justify-between text-[9px] text-text-muted mb-0.5 font-mono">
        <span>{away}%</span>
        <span>{home}%</span>
      </div>
      <div className="h-1 rounded-full bg-border overflow-hidden flex">
        <div className="bg-accent transition-all duration-700" style={{ width: `${away}%` }} />
        <div className="bg-live transition-all duration-700" style={{ width: `${home}%` }} />
      </div>
    </div>
  )
}

function StatusBadge({ event }: { event: EspnEvent }) {
  if (isLive(event)) {
    return (
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-live animate-pulse" />
        <span className="text-[10px] font-mono text-live font-semibold">
          {event.status.displayClock} {periodShortLabel(event.status.period, event.uid)}
        </span>
      </div>
    )
  }

  if (isFinal(event)) {
    return <span className="text-[10px] font-semibold text-text-muted uppercase">Final</span>
  }

  return <span className="text-[10px] font-mono text-text-muted">{formatGameTime(event.date)}</span>
}

export default function MiniGameCard({ sportEvent, onClick, variant = "compact" }: Props) {
  const { event, sportIcon } = sportEvent
  const comp = event.competitions?.[0]
  if (!comp) return null

  const home = comp.competitors.find((c) => c.homeAway === "home")
  const away = comp.competitors.find((c) => c.homeAway === "away")
  if (!home || !away) return null

  const probability = comp.situation?.lastPlay?.probability
  const showScore = isLive(event) || isFinal(event)
  const icon = getSportIcon(sportIcon)

  if (variant === "hero") {
    return (
      <button
        onClick={() => onClick?.(event)}
        className="w-full text-left bg-surface hover:bg-surface-hover border border-border rounded-xl p-4 transition-colors duration-150"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-accent">
            <span className="w-4 h-4">{icon}</span>
            <StatusBadge event={event} />
          </div>
          <span className="text-[10px] text-text-muted">{sportEvent.sportName}</span>
        </div>

        <div className="space-y-2">
          <MiniTeamRow team={away.team} score={away.score} isWinner={away.winner} showScore={showScore} />
          <MiniTeamRow team={home.team} score={home.score} isWinner={home.winner} showScore={showScore} />
        </div>

        {probability && <WinProbBar probability={probability} />}
      </button>
    )
  }

  return (
    <button
      onClick={() => onClick?.(event)}
      className="w-full text-left bg-court-light/30 hover:bg-surface-hover rounded-lg px-3 py-2.5 transition-colors duration-150"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 shrink-0">
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
          <span className="text-text-muted text-[10px]">@</span>
          <div className="flex items-center gap-1.5 shrink-0">
            <div
              className="w-5 h-5 rounded flex items-center justify-center"
              style={{ background: hexToRgba(home.team.color, 0.15) }}
            >
              {home.team.logos?.[0] ? (
                <img src={home.team.logos[0].href} alt={home.team.abbreviation} className="w-3.5 h-3.5 object-contain" loading="lazy" />
              ) : (
                <span className="text-[8px] font-bold" style={{ color: `#${home.team.color}` }}>{home.team.abbreviation}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {showScore ? (
            <span className="text-xs font-mono text-text-primary tabular-nums">
              {away.score} - {home.score}
            </span>
          ) : null}
          <StatusBadge event={event} />
        </div>
      </div>
    </button>
  )
}
