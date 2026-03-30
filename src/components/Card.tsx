import type { ReactNode } from "react"

interface Props {
  title: string
  subtitle?: string
  icon?: ReactNode
  children: ReactNode
  className?: string
}

export default function Card({ title, subtitle, icon, children, className = "" }: Props) {
  return (
    <div className={`bg-surface rounded-xl border border-border overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        {icon && <span className="text-accent">{icon}</span>}
        <div>
          <h2 className="text-sm font-semibold text-text-primary tracking-wide uppercase">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-text-muted mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}
