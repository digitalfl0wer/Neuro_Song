import type { VibeType, FormatType } from "./PromptCard";
import { BrainLoadingAnimation } from "./BrainLoadingAnimation";

interface ResultCardProps {
  result: string | null;
  isLoading: boolean;
  vibe: VibeType;
  format: FormatType;
  onRegenerate: () => void;
  onApprove: () => void;
  isApproved: boolean;
  onHeart?: (verse: string) => void;
  isHearted?: boolean;
  prompt?: string;
  length?: string;
  explanation?: string | null;
}

export function ResultCard({
  result,
  isLoading,
  vibe,
  format,
  onRegenerate,
  onApprove,
  isApproved,
  onHeart,
  isHearted,
  explanation,
}: ResultCardProps) {
  if (isLoading) {
    return (
      <div className="bg-[#0f041c] rounded-2xl shadow-2xl shadow-purple-900/30 p-6 border border-white/10">
        <BrainLoadingAnimation />
        <p className="text-center text-purple-300 mt-4 font-medium text-lg">
          Crafting your {vibe} {format}...
        </p>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="bg-[#0f041c] rounded-2xl shadow-2xl shadow-purple-900/30 p-6 border border-white/10">
      <div className="mb-4">
        <span className="inline-block px-4 py-1.5 bg-white text-purple-900 rounded-full text-base font-semibold tracking-wide shadow-inner">
          Vibe confirmed: {vibe} {format}
        </span>
      </div>

      <div className="prose prose-sm max-w-none mb-6">
        <div className="whitespace-pre-line text-white leading-relaxed text-xl md:text-2xl">
          {result.split("\n").map((line, idx) => (
            <p key={idx} className={line.trim() === "" ? "h-4" : ""}>
              {line}
            </p>
          ))}
        </div>
      </div>

      {explanation && (
        <div className="mb-6 p-4 bg-white/10 border border-white/20 rounded-xl text-white space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-300 mb-1">
            What this teaches
          </p>
          <p className="text-base md:text-lg">{explanation}</p>
        </div>
      )}

      {!isApproved ? (
        <div className="flex gap-4">
          <button
            onClick={onRegenerate}
            className="flex-1 px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            aria-label="Regenerate verse"
          >
            🔄 Regenerate
          </button>
          <button
            onClick={onApprove}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            aria-label="Approve learning"
          >
            ✓ Approve Learning
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-medium">✓ Learning approved!</p>
          </div>
          {onHeart && result && (
            <button
              onClick={() => onHeart(result)}
              className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                isHearted
                  ? "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
                  : "border-2 border-red-500 text-red-500 hover:bg-red-50 focus:ring-red-500"
              }`}
              aria-label={isHearted ? "Remove from favorites" : "Add to favorites"}
            >
              {isHearted ? "❤️ Saved to Favorites" : "🤍 Save to Favorites"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
