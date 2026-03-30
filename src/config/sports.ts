export interface SportConfig {
  id: string
  name: string
  shortName: string
  slug: string
  icon: string
  capabilities: {
    injuries: boolean
    odds: boolean
    winProbability: boolean
  }
}

export const SPORTS: SportConfig[] = [
  {
    id: "nba",
    name: "NBA",
    shortName: "NBA",
    slug: "basketball/nba",
    icon: "basketball",
    capabilities: { injuries: true, odds: true, winProbability: true },
  },
  {
    id: "wnba",
    name: "WNBA",
    shortName: "WNBA",
    slug: "basketball/wnba",
    icon: "basketball",
    capabilities: { injuries: true, odds: true, winProbability: true },
  },
  {
    id: "nfl",
    name: "NFL",
    shortName: "NFL",
    slug: "football/nfl",
    icon: "football",
    capabilities: { injuries: true, odds: true, winProbability: true },
  },
  {
    id: "cfb",
    name: "College Football",
    shortName: "CFB",
    slug: "football/college-football",
    icon: "football",
    capabilities: { injuries: true, odds: true, winProbability: false },
  },
  {
    id: "mlb",
    name: "MLB",
    shortName: "MLB",
    slug: "baseball/mlb",
    icon: "baseball",
    capabilities: { injuries: true, odds: true, winProbability: true },
  },
  {
    id: "nhl",
    name: "NHL",
    shortName: "NHL",
    slug: "hockey/nhl",
    icon: "hockey",
    capabilities: { injuries: true, odds: true, winProbability: true },
  },
  {
    id: "cbb",
    name: "Men's CBB",
    shortName: "CBB",
    slug: "basketball/mens-college-basketball",
    icon: "basketball",
    capabilities: { injuries: false, odds: true, winProbability: false },
  },
  {
    id: "epl",
    name: "Premier League",
    shortName: "EPL",
    slug: "soccer/eng.1",
    icon: "soccer",
    capabilities: { injuries: false, odds: true, winProbability: false },
  },
  {
    id: "laliga",
    name: "La Liga",
    shortName: "LaLiga",
    slug: "soccer/esp.1",
    icon: "soccer",
    capabilities: { injuries: false, odds: true, winProbability: false },
  },
  {
    id: "mls",
    name: "MLS",
    shortName: "MLS",
    slug: "soccer/usa.1",
    icon: "soccer",
    capabilities: { injuries: false, odds: true, winProbability: false },
  },
]

export function getSportConfig(id: string): SportConfig {
  return SPORTS.find((s) => s.id === id) ?? SPORTS[0]
}

export function getSportBySlug(slug: string): SportConfig | undefined {
  return SPORTS.find((s) => s.slug === slug)
}
