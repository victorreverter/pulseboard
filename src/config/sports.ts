export interface SportConfig {
  id: string
  name: string
  shortName: string
  slug: string
  icon: string
  priority: number
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
    priority: 1,
    capabilities: { injuries: true, odds: true, winProbability: true },
  },
  {
    id: "nfl",
    name: "NFL",
    shortName: "NFL",
    slug: "football/nfl",
    icon: "football",
    priority: 2,
    capabilities: { injuries: true, odds: true, winProbability: true },
  },
  {
    id: "mlb",
    name: "MLB",
    shortName: "MLB",
    slug: "baseball/mlb",
    icon: "baseball",
    priority: 3,
    capabilities: { injuries: true, odds: true, winProbability: true },
  },
  {
    id: "nhl",
    name: "NHL",
    shortName: "NHL",
    slug: "hockey/nhl",
    icon: "hockey",
    priority: 4,
    capabilities: { injuries: true, odds: true, winProbability: true },
  },
  {
    id: "epl",
    name: "Premier League",
    shortName: "EPL",
    slug: "soccer/eng.1",
    icon: "soccer",
    priority: 5,
    capabilities: { injuries: false, odds: true, winProbability: false },
  },
  {
    id: "laliga",
    name: "La Liga",
    shortName: "LaLiga",
    slug: "soccer/esp.1",
    icon: "soccer",
    priority: 6,
    capabilities: { injuries: false, odds: true, winProbability: false },
  },
  {
    id: "mls",
    name: "MLS",
    shortName: "MLS",
    slug: "soccer/usa.1",
    icon: "soccer",
    priority: 7,
    capabilities: { injuries: false, odds: true, winProbability: false },
  },
  {
    id: "wnba",
    name: "WNBA",
    shortName: "WNBA",
    slug: "basketball/wnba",
    icon: "basketball",
    priority: 8,
    capabilities: { injuries: true, odds: true, winProbability: true },
  },
  {
    id: "cfb",
    name: "College Football",
    shortName: "CFB",
    slug: "football/college-football",
    icon: "football",
    priority: 9,
    capabilities: { injuries: true, odds: true, winProbability: false },
  },
  {
    id: "cbb",
    name: "Men's CBB",
    shortName: "CBB",
    slug: "basketball/mens-college-basketball",
    icon: "basketball",
    priority: 10,
    capabilities: { injuries: false, odds: true, winProbability: false },
  },
]

export function getSportConfig(id: string): SportConfig {
  return SPORTS.find((s) => s.id === id) ?? SPORTS[0]
}

export function getSportBySlug(slug: string): SportConfig | undefined {
  return SPORTS.find((s) => s.slug === slug)
}
