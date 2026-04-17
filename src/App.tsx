import { useState, useCallback } from "react"
import { useApiData } from "./hooks/useApiData"
import { useMultiSport } from "./hooks/useMultiSport"
import { useSport } from "./hooks/useSport"
import { getScoreboard, getTeams, getInjuries } from "./services/espn"
import { todayParam } from "./lib/dates"
import type { EspnEvent, EspnTeam } from "./types/espn"
import Header from "./components/Header"
import HomePage from "./components/HomePage"
import Scoreboard from "./components/Scoreboard"
import InjuryFeed from "./components/InjuryFeed"
import TeamGrid from "./components/TeamGrid"
import GameDetail from "./components/GameDetail"
import TeamDetail from "./components/TeamDetail"
import Spinner from "./components/Spinner"
import ErrorMessage from "./components/ErrorMessage"
import Card from "./components/Card"

const REFRESH_INTERVAL = 30_000

export default function App() {
  const { slug, config, setSport: setSportId } = useSport()
  const [view, setView] = useState<string>("home")
  const [date, setDate] = useState(todayParam)
  const [selectedGame, setSelectedGame] = useState<EspnEvent | null>(null)
  const [selectedTeam, setSelectedTeam] = useState<EspnTeam | null>(null)
  const [detailTeam, setDetailTeam] = useState<EspnTeam | null>(null)

  const multiSport = useMultiSport()

  const handleViewChange = useCallback((id: string) => {
    setView(id)
    if (id !== "home") {
      setSportId(id)
    }
    setSelectedTeam(null)
    setDetailTeam(null)
  }, [setSportId])

  const handleSeeAll = useCallback((sportId: string) => {
    setView(sportId)
    setSportId(sportId)
  }, [setSportId])

  const handleDateChange = useCallback((newDate: string) => {
    setDate(newDate)
  }, [])

  const handleTeamSelect = useCallback((team: EspnTeam) => {
    setSelectedTeam((prev) => (prev?.id === team.id ? null : team))
  }, [])

  const handleTeamClick = useCallback((team: EspnTeam) => {
    setDetailTeam(team)
  }, [])

  const scoreboard = useApiData(
    useCallback(() => getScoreboard(slug, date), [slug, date]),
    date === todayParam() ? REFRESH_INTERVAL : undefined
  )

  const teams = useApiData(
    useCallback(() => getTeams(slug), [slug])
  )

  const injuries = useApiData(
    useCallback(() => getInjuries(slug), [slug]),
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

  const subtitle = view === "home"
    ? "All Sports Live"
    : `${config.name} Live`

  return (
    <div className="min-h-screen bg-court relative">
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 15% 50%, rgba(255, 46, 147, 0.08), transparent 25%), radial-gradient(circle at 85% 30%, rgba(0, 255, 136, 0.05), transparent 25%)'
        }}
      />
      <Header
        currentView={view}
        subtitle={subtitle}
        onSportChange={handleViewChange}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {view === "home" ? (
          <HomePage
            state={multiSport}
            onGameClick={setSelectedGame}
            onSeeAll={handleSeeAll}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
            <div className="space-y-6">
              {scoreboard.status === "loading" && <Spinner />}
              {scoreboard.status === "error" && (
                <ErrorMessage message={`Scoreboard: ${scoreboard.error}`} />
              )}
              {scoreboard.status === "success" && (
                <Scoreboard
                  events={events}
                  date={date}
                  onDateChange={handleDateChange}
                  onGameClick={setSelectedGame}
                />
              )}
            </div>

            <div className="space-y-6">
              {teams.status === "success" && (
                <Card
                  title="Teams"
                  subtitle={selectedTeam ? `${selectedTeam.displayName} selected` : "Click to filter · Info icon for details"}
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  }
                >
                  <TeamGrid
                    teams={allTeams}
                    selectedId={selectedTeam?.id}
                    onSelect={handleTeamSelect}
                    onInfo={handleTeamClick}
                  />
                </Card>
              )}

              {config.capabilities.injuries && injuries.status === "loading" && <Spinner />}
              {config.capabilities.injuries && injuries.status === "error" && (
                <ErrorMessage message={`Injuries: ${injuries.error}`} />
              )}
              {config.capabilities.injuries && injuries.status === "success" && filteredInjuries.length > 0 && (
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
        )}
      </main>

      {selectedGame && (
        <GameDetail
          event={selectedGame}
          sportSlug={selectedGame.uid.includes("basketball") ? "basketball/nba" :
                     selectedGame.uid.includes("football") ? "football/nfl" :
                     selectedGame.uid.includes("hockey") ? "hockey/nhl" :
                     selectedGame.uid.includes("baseball") ? "baseball/mlb" :
                     selectedGame.uid.includes("soccer") ? "soccer/eng.1" : slug}
          onClose={() => setSelectedGame(null)}
        />
      )}

      {detailTeam && (
        <TeamDetail
          team={detailTeam}
          sportSlug={slug}
          onClose={() => setDetailTeam(null)}
        />
      )}
    </div>
  )
}
