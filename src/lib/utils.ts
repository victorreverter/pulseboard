export function hexToRgba(hex: string, alpha = 1): string {
  const clean = hex.replace("#", "")
  if (clean.length < 6) return `rgba(128, 128, 128, ${alpha})`
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function percentDisplay(value: number): string {
  return `${Math.round(value * 100)}%`
}

export function injuryStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "out":
      return "text-red-400"
    case "day-to-day":
      return "text-yellow-400"
    case "questionable":
      return "text-orange-400"
    case "doubtful":
      return "text-red-300"
    case "probable":
      return "text-green-400"
    default:
      return "text-text-secondary"
  }
}

import type { EspnTeam } from "../types/espn"

export function getTeamLogo(team: Partial<EspnTeam>, sportSlug?: string): string {
  if (team.logo && typeof team.logo === "string") return team.logo;
  if (team.logos && team.logos.length > 0) {
    const scoreboard = team.logos.find((l) => l.rel?.includes("scoreboard") || l.rel?.includes("default"));
    if (scoreboard?.href) return scoreboard.href;
    if (team.logos[0]?.href) return team.logos[0].href;
  }
  
  // Ultimate visual fallback using ESPN CDN if no logo object is found
  if (sportSlug && team.id) {
    // some sportSlugs are like "basketball/nba", we just need the sport "basketball" or "nba"
    // Actually ESPN's CDN accepts the sport group or league sometimes.
    const sport = sportSlug.split('/')[0] === "soccer" ? "soccer" : sportSlug.split('/').pop() || sportSlug;
    return `https://a.espncdn.com/i/teamlogos/${sport}/500/${team.id}.png`;
  }
  
  // Absolute fallback to a generic placeholder (or the ESPN default)
  return "https://a.espncdn.com/combiner/i?img=/i/teamlogos/default-team-logo-500.png"
}

export function getPlayerHeadshot(athlete: any, sportSlug?: string): string | undefined {
  if (typeof athlete.headshot === "string") return athlete.headshot;
  if (athlete.headshot?.href) return athlete.headshot.href;
  if (!sportSlug || !athlete.id) return undefined;

  const parts = sportSlug.split('/');
  const league = parts[0] === 'soccer' ? 'soccer' : parts.pop() || sportSlug;
  
  return `https://a.espncdn.com/combiner/i?img=/i/headshots/${league}/players/full/${athlete.id}.png&w=350&h=254`;
}
