"use client";

export function BrainLoadingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Brain Assembly Animation */}
      <div className="relative w-48 h-48 mb-6">
        {/* Left Hemisphere */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 text-6xl animate-brain-left"
          style={{
            animationDelay: "0s",
          }}
        >
          🧠
        </div>

        {/* Right Hemisphere (flipped brain) */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 text-6xl animate-brain-right"
          style={{
            animationDelay: "0.3s",
            transform: "translateY(-50%) scaleX(-1)",
          }}
        >
          🧠
        </div>

        {/* Cerebellum/Bottom Section */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 text-5xl animate-brain-bottom"
          style={{
            animationDelay: "0.6s",
          }}
        >
          🌸
        </div>

        {/* Synapses/Sparkles connecting */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl animate-brain-sparkles"
          style={{
            animationDelay: "0.9s",
          }}
        >
          ✨
        </div>

        {/* Neural connections - small sparkles around */}
        <div
          className="absolute top-1/4 left-1/4 text-xl animate-brain-sparkles"
          style={{
            animationDelay: "1.0s",
          }}
        >
          ⚡
        </div>
        <div
          className="absolute top-1/4 right-1/4 text-xl animate-brain-sparkles"
          style={{
            animationDelay: "1.1s",
          }}
        >
          ⚡
        </div>
        <div
          className="absolute bottom-1/3 left-1/3 text-xl animate-brain-sparkles"
          style={{
            animationDelay: "1.2s",
          }}
        >
          ⚡
        </div>
        <div
          className="absolute bottom-1/3 right-1/3 text-xl animate-brain-sparkles"
          style={{
            animationDelay: "1.3s",
          }}
        >
          ⚡
        </div>

        {/* Pulsing glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-2xl animate-pulse-slow"></div>
      </div>

      {/* Loading text */}
      <p className="text-center text-purple-600 font-medium text-lg animate-pulse">
        Building your brain beat...
      </p>
    </div>
  );
}

