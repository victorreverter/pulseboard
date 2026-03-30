export default function Header() {
  return (
    <header className="border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center">
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-primary tracking-tight">PulseBoard</h1>
            <p className="text-[10px] text-text-muted uppercase tracking-widest">NBA Live</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-live/10 border border-live/20">
            <span className="w-1.5 h-1.5 rounded-full bg-live animate-pulse" />
            <span className="text-[10px] font-mono text-live font-semibold">LIVE</span>
          </span>
        </div>
      </div>
    </header>
  )
}
