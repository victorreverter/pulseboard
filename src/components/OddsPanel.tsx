import { useState, useEffect } from "react"
import { getOdds } from "../services/espn"
import type { EspnOddsResponse } from "../types/espn"
import Spinner from "./Spinner"

interface Props {
  sportSlug: string
  eventId: string
  competitionId: string
  homeName: string
  awayName: string
}

function OddsValue({ label, current, open }: { label: string; current: string; open: string }) {
  const moved = current !== open
  return (
    <div className="text-center">
      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-mono font-bold text-text-primary">{current}</p>
      {moved && (
        <p className="text-[10px] text-text-muted font-mono">
          Open: {open}
        </p>
      )}
    </div>
  )
}

type OddsState =
  | { status: "loading" }
  | { status: "success"; data: EspnOddsResponse }
  | { status: "error" }

export default function OddsPanel({ sportSlug, eventId, competitionId, homeName, awayName }: Props) {
  const [state, setState] = useState<OddsState>({ status: "loading" })

  useEffect(() => {
    let cancelled = false

    async function fetchOdds() {
      setState({ status: "loading" })
      try {
        const data = await getOdds(sportSlug, eventId, competitionId)
        if (!cancelled) setState({ status: "success", data })
      } catch {
        if (!cancelled) setState({ status: "error" })
      }
    }

    fetchOdds()

    return () => { cancelled = true }
  }, [sportSlug, eventId, competitionId])

  if (state.status === "loading") return <Spinner className="py-4" />
  if (state.status === "error") return <p className="text-text-muted text-xs text-center py-4">Odds unavailable</p>

  const odds = state.data

  return (
    <div className="bg-court-light/50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] text-text-muted uppercase tracking-wider">Odds</span>
        <span className="text-[10px] text-text-muted">{odds.provider.name}</span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <OddsValue
          label="Spread"
          current={odds.details}
          open={`${awayName.split(" ").pop()} ${odds.awayTeamOdds.open.pointSpread.alternateDisplayValue}`}
        />
        <OddsValue
          label="Total"
          current={odds.current.total.alternateDisplayValue}
          open={odds.open.total.alternateDisplayValue}
        />
        <div className="text-center">
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">O/U Odds</p>
          <p className="text-sm font-mono font-bold text-text-primary">
            {odds.overOdds > 0 ? "+" : ""}{odds.overOdds} / {odds.underOdds > 0 ? "+" : ""}{odds.underOdds}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-court/50 rounded-lg p-3">
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2 truncate">{awayName}</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[10px] text-text-muted">ML</span>
              <span className="text-xs font-mono font-bold text-text-primary">
                {odds.awayTeamOdds.moneyLine > 0 ? "+" : ""}{odds.awayTeamOdds.current.moneyLine.american}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-text-muted">Spread</span>
              <span className="text-xs font-mono font-bold text-text-primary">
                {odds.awayTeamOdds.current.pointSpread.alternateDisplayValue}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-text-muted">Open ML</span>
              <span className="text-xs font-mono text-text-muted">
                {odds.awayTeamOdds.open.moneyLine.alternateDisplayValue}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-court/50 rounded-lg p-3">
          <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2 truncate">{homeName}</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-[10px] text-text-muted">ML</span>
              <span className="text-xs font-mono font-bold text-text-primary">
                {odds.homeTeamOdds.moneyLine > 0 ? "+" : ""}{odds.homeTeamOdds.current.moneyLine.american}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-text-muted">Spread</span>
              <span className="text-xs font-mono font-bold text-text-primary">
                {odds.homeTeamOdds.current.pointSpread.alternateDisplayValue}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] text-text-muted">Open ML</span>
              <span className="text-xs font-mono text-text-muted">
                {odds.homeTeamOdds.open.moneyLine.alternateDisplayValue}
              </span>
            </div>
          </div>
        </div>
      </div>

      {odds.moneylineWinner && (
        <p className="text-[10px] text-text-muted text-center mt-3">
          Spread winner: {odds.spreadWinner ? "Yes" : "No"} · ML winner: Yes
        </p>
      )}
    </div>
  )
}
