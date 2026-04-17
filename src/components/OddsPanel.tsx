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

function Arrow({ isUp }: { isUp: boolean }) {
  if (isUp) {
    return <svg className="w-3 h-3 text-live ml-1 inline-block drop-shadow-[0_0_2px_rgba(0,255,136,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" /></svg>
  }
  return <svg className="w-3 h-3 text-accent ml-1 inline-block drop-shadow-[0_0_2px_rgba(255,46,147,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
}

function OddsValue({ label, current, isUp }: { label: string; current: string; isUp: boolean | null }) {
  return (
    <div className="text-center bg-surface/30 backdrop-blur-sm rounded-xl p-2 border border-white/5 relative group hover:border-white/10 transition-colors">
      <p className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-mono font-bold text-text-primary flex items-center justify-center">
        {current}
        {isUp !== null && <Arrow isUp={isUp} />}
      </p>
    </div>
  )
}

function OddsRow({ label, current, openNum, currentNum }: { label: string; current: string; openNum: number | string; currentNum: number | string }) {
  let isUp = null
  const cNum = parseFloat(String(currentNum)) || 0
  const oNum = parseFloat(String(openNum)) || 0
  if (cNum > oNum) isUp = true
  if (cNum < oNum) isUp = false

  return (
    <div className="flex justify-between items-center py-1.5 px-2 rounded-md hover:bg-white/5 transition-colors">
      <span className="text-[10px] text-text-muted uppercase tracking-wide">{label}</span>
      <span className="text-xs font-mono font-bold text-text-primary flex items-center">
        {current}
        {isUp !== null && <Arrow isUp={isUp} />}
      </span>
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

  if (state.status === "loading") return <Spinner className="py-2" />
  if (state.status === "error") return null

  const odds = state.data
  const totalCurr = parseFloat(odds.current.total.alternateDisplayValue || odds.current.total.american) || 0
  const totalOpen = parseFloat(odds.open.total.alternateDisplayValue || odds.open.total.american) || 0

  return (
    <div className="bg-court/30 backdrop-blur-md rounded-2xl p-4 border border-white/5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
          <svg className="w-4 h-4 text-accent drop-shadow-[0_0_5px_rgba(255,46,147,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          Market Odds
        </span>
        <span className="text-[10px] text-text-muted px-2 py-0.5 rounded-full bg-white/5 border border-white/10">{odds.provider.name}</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <OddsValue
          label="Spread"
          current={odds.details}
          isUp={null} // Complex to parse reliably for both teams
        />
        <OddsValue
          label="Total"
          current={odds.current.total.alternateDisplayValue || odds.current.total.american}
          isUp={totalCurr > totalOpen ? true : totalCurr < totalOpen ? false : null}
        />
        <OddsValue
          label="O/U Odds"
          current={`${odds.overOdds > 0 ? "+" : ""}${odds.overOdds} / ${odds.underOdds > 0 ? "+" : ""}${odds.underOdds}`}
          isUp={null}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface/40 rounded-xl p-3 border border-white/5">
          <p className="text-[11px] font-bold text-text-primary uppercase tracking-wider mb-2 truncate px-1 border-l-2 border-text-secondary pl-2">{awayName}</p>
          <div className="space-y-1">
            <OddsRow
              label="Moneyline"
              current={`${odds.awayTeamOdds.moneyLine > 0 ? "+" : ""}${odds.awayTeamOdds.current.moneyLine.american}`}
              currentNum={odds.awayTeamOdds.current.moneyLine.american}
              openNum={odds.awayTeamOdds.open.moneyLine.american}
            />
            <OddsRow
              label="Spread"
              current={odds.awayTeamOdds.current.pointSpread.alternateDisplayValue}
              currentNum={odds.awayTeamOdds.current.pointSpread.american}
              openNum={odds.awayTeamOdds.open.pointSpread.american}
            />
          </div>
        </div>
        
        <div className="bg-surface/40 rounded-xl p-3 border border-white/5">
          <p className="text-[11px] font-bold text-text-primary uppercase tracking-wider mb-2 truncate px-1 border-l-2 border-text-secondary pl-2">{homeName}</p>
          <div className="space-y-1">
            <OddsRow
              label="Moneyline"
              current={`${odds.homeTeamOdds.moneyLine > 0 ? "+" : ""}${odds.homeTeamOdds.current.moneyLine.american}`}
              currentNum={odds.homeTeamOdds.current.moneyLine.american}
              openNum={odds.homeTeamOdds.open.moneyLine.american}
            />
            <OddsRow
              label="Spread"
              current={odds.homeTeamOdds.current.pointSpread.alternateDisplayValue}
              currentNum={odds.homeTeamOdds.current.pointSpread.american}
              openNum={odds.homeTeamOdds.open.pointSpread.american}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
