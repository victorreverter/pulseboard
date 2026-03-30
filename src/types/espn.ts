export interface EspnLogo {
  href: string
  width: number
  height: number
  alt: string
  rel: string[]
  lastUpdated?: string
}

export interface EspnLink {
  language: string
  rel: string[]
  href: string
  text: string
  shortText: string
  isExternal: boolean
  isPremium: boolean
}

export interface EspnTeam {
  id: string
  uid: string
  slug: string
  abbreviation: string
  displayName: string
  shortDisplayName: string
  name: string
  nickname: string
  location: string
  color: string
  alternateColor: string
  isActive: boolean
  isAllStar: boolean
  logos: EspnLogo[]
  links?: EspnLink[]
}

export interface EspnAthlete {
  firstName: string
  lastName: string
  displayName: string
  shortName: string
  links: EspnLink[]
  headshot: {
    href: string
    alt: string
  }
  position: {
    id: string
    name: string
    displayName: string
    abbreviation: string
  }
  team?: EspnTeam
}

export interface EspnStat {
  name: string
  displayName: string
  shortDisplayName: string
  description: string
  abbreviation: string
  value: number
  displayValue: string
}

export interface EspnStatCategory {
  name: string
  displayName: string
  abbreviation: string
  stats: EspnStat[]
}

export interface EspnLeaderAthlete {
  displayValue: string
  athlete: {
    id: string
    fullName: string
    displayName: string
    shortName: string
    headshot: { href: string; alt: string }
    jersey: string
    position: { abbreviation: string }
  }
}

export interface EspnLeaderCategory {
  name: string
  displayName: string
  leaders: EspnLeaderAthlete[]
}

export interface EspnRecord {
  name: string
  abbreviation: string
  type: string
  summary: string
}

export interface EspnLineScore {
  value: number
  displayValue: string
  period: number
}

export interface EspnCompetitor {
  id: string
  uid: string
  type: string
  order: number
  homeAway: "home" | "away"
  winner: boolean
  team: EspnTeam
  score: string
  linescores: EspnLineScore[]
  statistics: EspnStat[]
  leaders: EspnLeaderCategory[]
  records: EspnRecord[]
}

export interface EspnVenue {
  id: string
  fullName: string
  address: {
    city: string
    state: string
  }
  indoor: boolean
}

export interface EspnBroadcast {
  names: string[]
}

export interface EspnHeadline {
  description: string
  type: string
  shortLinkText: string
}

export interface EspnCompetition {
  id: string
  uid: string
  date: string
  attendance: number
  type: { id: string; abbreviation: string }
  timeValid: boolean
  neutralSite: boolean
  conferenceCompetition: boolean
  playByPlayAvailable: boolean
  recent: boolean
  venue: EspnVenue
  competitors: EspnCompetitor[]
  notes: { type: string; headline: string }[]
  status: EspnGameStatus
  broadcasts: EspnBroadcast[]
  headlines: EspnHeadline[]
  highlights?: unknown[]
}

export interface EspnGameStatus {
  clock: number
  displayClock: string
  period: number
  type: {
    id: string
    name: string
    state: string
    completed: boolean
    description: string
    detail: string
    shortDetail: string
  }
}

export interface EspnWinProbability {
  tiePercentage: number
  homeWinPercentage: number
  awayWinPercentage: number
}

export interface EspnSituation {
  lastPlay: {
    id: string
    type: { id: string; text: string }
    text: string
    scoreValue: number
    probability: EspnWinProbability
  }
}

export interface EspnEvent {
  id: string
  uid: string
  date: string
  name: string
  shortName: string
  season: {
    year: number
    type: number
    slug: string
  }
  competitions: EspnCompetition[]
  links?: EspnLink[]
  status: EspnGameStatus
}

export interface EspnSeason {
  year: number
  startDate: string
  endDate: string
  displayName: string
  type: {
    id: string
    type: number
    name: string
    abbreviation: string
  }
}

export interface EspnLeague {
  id: string
  uid: string
  name: string
  abbreviation: string
  slug: string
  season: EspnSeason
  logos: EspnLogo[]
}

export interface EspnScoreboardResponse {
  leagues: EspnLeague[]
  season: { type: number; year: number }
  day: string
  events: EspnEvent[]
  provider: { id: string; name: string }
}

export interface EspnTeamsResponse {
  sports: {
    id: string
    uid: string
    name: string
    slug: string
    leagues: {
      id: string
      uid: string
      name: string
      abbreviation: string
      shortName: string
      slug: string
      teams: { team: EspnTeam }[]
      year: number
      season: EspnSeason
    }[]
  }[]
}

export interface EspnInjuryDetail {
  longComment: string
  shortComment: string
  status: string
  date: string
  athlete: EspnAthlete
  notes: {
    items: {
      id: string
      type: string
      date: string
      headline: string
      text: string
      source: string
    }[]
  }
  source: { id: string; description: string; state: string }
  type: { id: string; name: string; type: string; abbreviation: string }
  details: {
    fantasyStatus: { description: string; abbreviation: string }
    type: string
    location: string
    detail: string
    side: string
    returnDate: string
  }
}

export interface EspnInjuriesResponse {
  timestamp: string
  status: string
  season: { year: number; type: number; name: string; displayName: string }
  injuries: {
    id: string
    displayName: string
    injuries: EspnInjuryDetail[]
  }[]
}

export interface EspnOddsOpenClose {
  favorite: boolean
  pointSpread: { alternateDisplayValue: string; american: string }
  spread: {
    value: number
    displayValue: string
    alternateDisplayValue: string
    decimal: number
    fraction: string
    american: string
  }
  moneyLine: {
    value: number
    displayValue: string
    alternateDisplayValue: string
    decimal: number
    fraction: string
    american: string
  }
}

export interface EspnOddsTeamOdds {
  favorite: boolean
  underdog: boolean
  moneyLine: number
  spreadOdds: number
  open: EspnOddsOpenClose
  close: EspnOddsOpenClose
  current: EspnOddsOpenClose
  team: { $ref: string }
}

export interface EspnOddsResponse {
  provider: { id: string; name: string; priority: number }
  details: string
  overUnder: number
  spread: number
  overOdds: number
  underOdds: number
  awayTeamOdds: EspnOddsTeamOdds
  homeTeamOdds: EspnOddsTeamOdds
  moneylineWinner: boolean
  spreadWinner: boolean
  open: {
    over: { value: number; displayValue: string; alternateDisplayValue: string; decimal: number; fraction: string; american: string }
    under: { value: number; displayValue: string; alternateDisplayValue: string; decimal: number; fraction: string; american: string }
    total: { alternateDisplayValue: string; american: string }
  }
  close: {
    over: { value: number; displayValue: string; alternateDisplayValue: string; decimal: number; fraction: string; american: string }
    under: { value: number; displayValue: string; alternateDisplayValue: string; decimal: number; fraction: string; american: string }
    total: { alternateDisplayValue: string; american: string }
  }
  current: {
    over: { value: number; displayValue: string; alternateDisplayValue: string; decimal: number; fraction: string; american: string }
    under: { value: number; displayValue: string; alternateDisplayValue: string; decimal: number; fraction: string; american: string }
    total: { alternateDisplayValue: string; american: string }
  }
}
