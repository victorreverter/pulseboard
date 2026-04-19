import type { EspnInjuryDetail } from "../types/espn"
import { injuryStatusColor, getPlayerHeadshot } from "../lib/utils"

interface Props {
  sportSlug?: string
  injuries: {
    id: string
    displayName: string
    injuries: EspnInjuryDetail[]
  }[]
}

export default function InjuryFeed({ injuries, sportSlug }: Props) {
  const allInjuries = injuries
    .flatMap((team) =>
      team.injuries.map((inj) => ({
        ...inj,
        teamName: team.displayName,
        teamId: team.id,
      }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (allInjuries.length === 0) {
    return <p className="text-text-muted text-sm text-center py-6">No injury reports</p>
  }

  return (
    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
      {allInjuries.slice(0, 20).map((inj) => {
        const logo = inj.athlete.team?.logos?.find((l) => l.rel.includes("default"))?.href
        const headshot = getPlayerHeadshot(inj.athlete, sportSlug)
        
        return (
          <div
            key={`${inj.teamId}-${inj.athlete.displayName}-${inj.date}`}
            className="flex items-start gap-3 p-3 rounded-lg bg-court-light/50 hover:bg-surface-hover transition-colors"
          >
            <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-border/30 flex items-center justify-center">
              {logo ? (
                <img src={logo} alt={inj.teamName} className="w-6 h-6 object-contain" />
              ) : (
                <span className="text-[10px] text-text-muted">
                  {inj.athlete.displayName.charAt(0)}
                </span>
              )}
              {headshot && (
                <img
                  src={headshot}
                  alt={inj.athlete.displayName}
                  className="absolute inset-0 w-full h-full object-cover bg-surface"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-text-primary truncate">
                  {inj.athlete.displayName}
                </p>
                <span className={`text-[10px] font-semibold uppercase ${injuryStatusColor(inj.status)}`}>
                  {inj.status}
                </span>
              </div>
              <p className="text-xs text-text-muted truncate mt-0.5">
                {inj.details?.type && `${inj.details.type}`}
                {inj.details?.location && ` · ${inj.details.location}`}
                {inj.details?.side && ` (${inj.details.side})`}
              </p>
              <p className="text-[11px] text-text-secondary mt-1 line-clamp-2">
                {inj.shortComment}
              </p>
              <p className="text-[10px] text-text-muted mt-1">
                {inj.teamName} · {new Date(inj.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
