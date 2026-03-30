import type { ReactNode } from "react"

const icons: Record<string, ReactNode> = {
  basketball: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M4.93 4.93c4.08 2.64 6.71 6.95 7.07 12.07" />
      <path d="M19.07 4.93c-4.08 2.64-6.71 6.95-7.07 12.07" />
      <path d="M2 12h20" />
      <path d="M12 2v20" />
    </svg>
  ),
  football: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="12" rx="10" ry="6" transform="rotate(-45 12 12)" />
      <path d="M9 9l6 6" />
      <path d="M14.5 7.5l1 1" />
      <path d="M8.5 13.5l1 1" />
      <path d="M12 8l1 1" />
      <path d="M11 13l1 1" />
    </svg>
  ),
  baseball: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M6.3 3.7c-1.2 2.4-1.2 5.3 0 7.8" />
      <path d="M3.7 6.3c2.4 1.2 5.3 1.2 7.8 0" />
      <path d="M17.7 20.3c1.2-2.4 1.2-5.3 0-7.8" />
      <path d="M20.3 17.7c-2.4-1.2-5.3-1.2-7.8 0" />
    </svg>
  ),
  hockey: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
      <path d="M12 2c-2 3-3 6-3 10s1 7 3 10" />
      <path d="M12 2c2 3 3 6 3 10s-1 7-3 10" />
      <path d="M2 12h20" />
    </svg>
  ),
  soccer: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2l3 7h-6z" />
      <path d="M17.5 5.5l-2 6.5 5.5 2.5" />
      <path d="M21 14l-6 1-1 6" />
      <path d="M12 22l-3-7h6z" />
      <path d="M6.5 18.5l2-6.5-5.5-2.5" />
      <path d="M3 10l6-1 1-6" />
    </svg>
  ),
}

export function getSportIcon(iconName: string): ReactNode {
  return icons[iconName] ?? icons.basketball
}
