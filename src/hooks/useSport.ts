import { useState, useEffect, useCallback } from "react"
import type { SportConfig } from "../config/sports"
import { SPORTS, getSportConfig } from "../config/sports"

const STORAGE_KEY = "pulseboard:sport"

function loadSport(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && SPORTS.some((s) => s.id === saved)) return saved
  } catch {
    // localStorage unavailable (private browsing, etc)
  }
  return "nba"
}

export function useSport() {
  const [sportId, setSportId] = useState(loadSport)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, sportId)
    } catch {
      // localStorage unavailable
    }
  }, [sportId])

  const config: SportConfig = getSportConfig(sportId)

  const setSport = useCallback((id: string) => {
    setSportId(id)
  }, [])

  return {
    sportId,
    slug: config.slug,
    config,
    setSport,
  }
}
