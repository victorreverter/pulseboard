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
