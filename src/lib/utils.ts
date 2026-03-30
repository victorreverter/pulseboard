export function hexToRgba(hex: string, alpha = 1): string {
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function formatTime(isoDate: string): string {
  const d = new Date(isoDate)
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export function formatDate(isoDate: string): string {
  const d = new Date(isoDate)
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
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
