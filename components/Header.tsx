"use client";

interface HeaderProps {
  onToggleSaved?: () => void;
  showingSaved?: boolean;
  savedCount?: number;
}

export function Header({ onToggleSaved, showingSaved, savedCount = 0 }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/5 backdrop-blur-3xl shadow-lg">
      <div className="container mx-auto max-w-5xl px-6 py-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-500">
            NeuroSong Learning Studio
          </h1>
        </div>
        {onToggleSaved && (
          <button
            onClick={onToggleSaved}
            className={`flex items-center gap-3 px-7 py-3 rounded-full text-base md:text-lg font-bold transition-all duration-200 focus:ring-2 focus:ring-white focus:ring-offset-2 ${
              showingSaved
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-2xl shadow-pink-500/50"
                : "bg-white/10 text-white border border-white/40 hover:bg-white/20"
            }`}
            aria-label={showingSaved ? "Show prompt interface" : "Show saved verses"}
          >
            <span className="text-2xl">{showingSaved ? "🔄" : "✨"}</span>
            <span>
              {showingSaved ? "Create new verse" : "Open favorites"}
            </span>
            {!showingSaved && savedCount > 0 && (
              <span className="bg-red-500 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );
}
