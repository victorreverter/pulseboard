import { useState, useCallback } from "react"
import { useApiData } from "./hooks/useApiData"
import { getScoreboard, getTeams, getInjuries, todayParam } from "./services/espn"
import type { EspnEvent, EspnTeam } from "./types/espn"
import Header from "./components/Header"
import Scoreboard from "./components/Scoreboard"
import InjuryFeed from "./components/InjuryFeed"
import TeamGrid from "./components/TeamGrid"
import GameDetail from "./components/GameDetail"
import Spinner from "./components/Spinner"
import ErrorMessage from "./components/ErrorMessage"
import Card from "./components/Card"

const REFRESH_INTERVAL = 30_000

export default function App() {
  const [selectedGame, setSelectedGame] = useState<EspnEvent | null>(null)
  const [selectedTeam, setSelectedTeam] = useState<EspnTeam | null>(null)

  const scoreboard = useApiData(
    useCallback(() => getScoreboard(todayParam()), []),
    REFRESH_INTERVAL
  )

  const teams = useApiData(
    useCallback(() => getTeams(), [])
  )

  const injuries = useApiData(
    useCallback(() => getInjuries(), []),
    REFRESH_INTERVAL
  )

  const events = scoreboard.status === "success"
    ? scoreboard.data.events
    : []

  const allTeams = teams.status === "success"
    ? teams.data.sports[0]?.leagues[0]?.teams.map((t) => t.team) ?? []
    : []

  const filteredInjuries = injuries.status === "success"
    ? selectedTeam
      ? injuries.data.injuries.filter((t) => t.id === selectedTeam.id)
      : injuries.data.injuries
    : []

  return (
    <div className="min-h-screen bg-court">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          <div className="space-y-6">
            {scoreboard.status === "loading" && <Spinner />}
            {scoreboard.status === "error" && (
              <ErrorMessage message={`Scoreboard: ${scoreboard.error}`} />
            )}
            {scoreboard.status === "success" && (
              <Scoreboard events={events} onGameClick={setSelectedGame} />
            )}
          </div>

          <div className="space-y-6">
            {teams.status === "success" && (
              <Card
                title="Teams"
                subtitle={selectedTeam ? `${selectedTeam.displayName} selected` : "Filter injuries"}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                }
              >
                <TeamGrid
                  teams={allTeams}
                  selectedId={selectedTeam?.id}
                  onSelect={(team) =>
                    setSelectedTeam((prev) => (prev?.id === team.id ? null : team))
                  }
                />
              </Card>
            )}

            {injuries.status === "loading" && <Spinner />}
            {injuries.status === "error" && (
              <ErrorMessage message={`Injuries: ${injuries.error}`} />
            )}
            {injuries.status === "success" && (
              <Card
                title="Injury Report"
                subtitle={`${filteredInjuries.reduce((sum, t) => sum + t.injuries.length, 0)} players`}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                }
              >
                <InjuryFeed injuries={filteredInjuries} />
              </Card>
            )}
          </div>
        </div>
      </main>

      {selectedGame && (
        <GameDetail event={selectedGame} onClose={() => setSelectedGame(null)} />
      )}
    </div>
  )
}
