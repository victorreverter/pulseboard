export default function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={`space-y-4 py-4 w-full ${className}`}>
      {[1, 2, 3].map((i) => (
        <div key={i} className="w-full h-[120px] rounded-xl bg-surface/50 border border-white/5 overflow-hidden relative backdrop-blur-sm">
          {/* Shimmer gradient */}
          <div 
            className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[pulse_2s_ease-in-out_infinite]"
            style={{ backgroundSize: '200% 100%' }} 
          />
          
          <div className="p-4 space-y-4 relative z-10 w-full h-full flex flex-col justify-center">
            <div className="flex items-center justify-between mb-2">
              <div className="w-1/4 h-3 bg-white/10 rounded" />
              <div className="w-1/6 h-3 bg-white/10 rounded" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 w-1/2">
                <div className="w-8 h-8 rounded-lg bg-white/10" />
                <div className="w-2/3 h-4 bg-white/10 rounded" />
              </div>
              <div className="w-8 h-6 bg-white/10 rounded" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 w-1/2">
                <div className="w-8 h-8 rounded-lg bg-white/10" />
                <div className="w-2/3 h-4 bg-white/10 rounded" />
              </div>
              <div className="w-8 h-6 bg-white/10 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
