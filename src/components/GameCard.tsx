import type { EspnEvent, EspnWinProbability } from "../types/espn"
import { hexToRgba } from "../lib/utils"
import { isLive, isFinal } from "../services/espn"

interface Props {
  event: EspnEvent
  onClick?: (event: EspnEvent) => void
}

function TeamRow({
  team,
  score,
  isWinner,
  isHome,
}: {
  team: { abbreviation: string; displayName: string; color: string; logos: { href: string; rel: string[] }[] }
  score: string
  isWinner: boolean
  isHome: boolean
}) {
  const logo = team.logos?.find((l) => l.rel.includes("scoreboard"))?.href ?? team.logos?.[0]?.href

  return (
    <div className="flex items-center gap-3 py-1.5">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: hexToRgba(team.color, 0.15) }}
      >
        {logo ? (
          <img src={logo} alt={team.abbreviation} className="w-6 h-6 object-contain" />
        ) : (
          <span className="text-xs font-bold" style={{ color: `#${team.color}` }}>
            {team.abbreviation}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isWinner ? "text-text-primary" : "text-text-secondary"}`}>
          {team.displayName}
        </p>
        <p className="text-[10px] text-text-muted uppercase">{isHome ? "Home" : "Away"}</p>
      </div>
      <span
        className={`text-lg font-mono font-bold tabular-nums ${isWinner ? "text-text-primary" : "text-text-muted"}`}
      >
        {score || "—"}
      </span>
    </div>
  )
}

function WinProbabilityBar({ probability }: { probability: EspnWinProbability }) {
  const home = Math.round(probability.homeWinPercentage * 100)
  const away = 100 - home

  return (
    <div className="mt-3">
      <div className="flex justify-between text-[10px] text-text-muted mb-1 font-mono">
        <span>{away}%</span>
        <span className="uppercase tracking-wider">Win Prob</span>
        <span>{home}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-border overflow-hidden flex">
        <div className="bg-accent transition-all duration-700" style={{ width: `${away}%` }} />
        <div className="bg-live transition-all duration-700" style={{ width: `${home}%` }} />
      </div>
    </div>
  )
}

function GameStatus({ event }: { event: EspnEvent }) {
  const status = event.status

  if (isLive(event)) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-live animate-pulse" />
        <span className="text-xs font-mono text-live font-semibold">
          {status.displayClock} - Q{status.period}
        </span>
      </div>
    )
  }

  if (isFinal(event)) {
    return (
      <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Final</span>
    )
  }

  const gameTime = new Date(event.date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  return (
    <span className="text-xs font-mono text-text-muted">{gameTime}</span>
  )
}

export default function GameCard({ event, onClick }: Props) {
  const comp = event.competitions?.[0]
  if (!comp) return null

  const home = comp.competitors.find((c) => c.homeAway === "home")
  const away = comp.competitors.find((c) => c.homeAway === "away")
  if (!home || !away) return null

  const situation = comp as unknown as { situation?: { lastPlay: { probability: EspnWinProbability } } }
  const probability = situation.situation?.lastPlay?.probability

  return (
    <button
      onClick={() => onClick?.(event)}
      className="w-full text-left bg-surface hover:bg-surface-hover border border-border rounded-xl p-4 transition-colors duration-150 group"
    >
      <div className="flex items-center justify-between mb-3">
        <GameStatus event={event} />
        {comp.headlines?.[0] && (
          <span className="text-[10px] text-text-muted truncate max-w-[60%]">
            {comp.headlines[0].description}
          </span>
        )}
      </div>

      <div className="space-y-0.5">
        <TeamRow team={away.team} score={away.score} isWinner={away.winner} isHome={false} />
        <div className="border-t border-border/50" />
        <TeamRow team={home.team} score={home.score} isWinner={home.winner} isHome={true} />
      </div>

      {isLive(event) && probability && <WinProbabilityBar probability={probability} />}

      {comp.venue && (
        <p className="text-[10px] text-text-muted mt-3 truncate">
          {comp.venue.fullName}, {comp.venue.address?.city}
        </p>
      )}
    </button>
  )
}
