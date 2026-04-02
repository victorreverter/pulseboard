export function parseGameDate(isoDate: string): Date {
  const d = new Date(isoDate)
  return d
}

export function getTodayLocal(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

export function isTomorrow(d: Date): boolean {
  const today = getTodayLocal()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  return isSameDay(d, tomorrow)
}

export function isYesterday(d: Date): boolean {
  const today = getTodayLocal()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  return isSameDay(d, yesterday)
}

export function formatGameDateLabel(isoDate: string): string {
  const d = parseGameDate(isoDate)
  const today = getTodayLocal()

  if (isSameDay(d, today)) return "Today"
  if (isTomorrow(d)) return "Tomorrow"
  if (isYesterday(d)) return "Yesterday"

  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
}

export function formatGameTime(isoDate: string): string {
  const d = parseGameDate(isoDate)
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

export function formatDateParam(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}${m}${d}`
}

export function todayParam(): string {
  return formatDateParam(new Date())
}

export function formatDisplayDate(dateStr: string): string {
  const y = parseInt(dateStr.slice(0, 4))
  const m = parseInt(dateStr.slice(4, 6)) - 1
  const d = parseInt(dateStr.slice(6, 8))
  const date = new Date(y, m, d)
  const today = getTodayLocal()

  if (isSameDay(date, today)) return "Today"
  if (isTomorrow(date)) return "Tomorrow"
  if (isYesterday(date)) return "Yesterday"

  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
}

export function shiftDate(dateStr: string, days: number): string {
  const y = parseInt(dateStr.slice(0, 4))
  const m = parseInt(dateStr.slice(4, 6)) - 1
  const d = parseInt(dateStr.slice(6, 8))
  const date = new Date(y, m, d + days)
  return formatDateParam(date)
}

export function getDateRange(): string[] {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  return [
    formatDateParam(yesterday),
    formatDateParam(today),
    formatDateParam(tomorrow),
  ]
}
