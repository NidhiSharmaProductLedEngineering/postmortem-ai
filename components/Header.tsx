export default function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-accent flex items-center justify-center">
            <span className="font-mono text-white text-xs font-bold">PM</span>
          </div>
          <div>
            <span className="font-sans font-medium text-slate-100 text-sm">PostMortem AI</span>
            <span className="text-muted text-xs ml-2 font-mono">v1.0</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow" />
          <span className="text-xs text-muted font-mono">GPT-4o powered</span>
        </div>
      </div>
    </header>
  )
}
