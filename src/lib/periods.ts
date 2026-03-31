export function periodLabels(count: number, uid: string): string[] {
  if (uid.includes("soccer")) {
    const labels = ["1H", "2H"]
    for (let i = 3; i <= count; i++) labels.push(`ET${i - 2}`)
    return labels.slice(0, count)
  }
  if (uid.includes("hockey")) {
    const labels = ["P1", "P2", "P3"]
    for (let i = 4; i <= count; i++) labels.push(`OT${i - 3}`)
    return labels.slice(0, count)
  }
  const labels = ["Q1", "Q2", "Q3", "Q4"]
  for (let i = 5; i <= count; i++) labels.push(`OT${i - 4}`)
  return labels.slice(0, count)
}

export function periodShortLabel(period: number, uid: string): string {
  if (uid.includes("soccer")) {
    return period === 1 ? "1H" : period === 2 ? "2H" : `ET${period - 2}`
  }
  if (uid.includes("hockey")) {
    return period <= 3 ? `P${period}` : `OT${period - 3}`
  }
  return period <= 4 ? `Q${period}` : `OT${period - 4}`
}
