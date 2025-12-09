import type { VibeType, FormatType, LengthType } from "./PromptCard";

interface ControlsSectionProps {
  length: LengthType;
  setLength: (length: LengthType) => void;
  vibe: VibeType;
  setVibe: (vibe: VibeType) => void;
  format: FormatType;
  setFormat: (format: FormatType) => void;
}

export function ControlsSection({
  length,
  setLength,
  vibe,
  setVibe,
  format,
  setFormat,
}: ControlsSectionProps) {
  return (
    <div className="mt-6 space-y-6">
      {/* Length Slider */}
      <div>
        <label htmlFor="length-slider" className="block text-2xl font-bold text-purple-100 mb-2">
          Length: <span className="text-purple-600 capitalize">{length}</span>
        </label>
        <input
          id="length-slider"
          type="range"
          min="0"
          max="2"
          step="1"
          value={length === "short" ? 0 : length === "medium" ? 1 : 2}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            setLength(val === 0 ? "short" : val === 1 ? "medium" : "long");
          }}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
          aria-label="Length slider"
        />
        <div className="flex justify-between text-lg text-purple-200 mt-1">
          <span>Short</span>
          <span>Medium</span>
          <span>Long</span>
        </div>
      </div>

      {/* Vibe Radio Buttons */}
      <div>
        <fieldset>
          <legend className="block text-2xl font-bold text-purple-100 mb-2">Vibe</legend>
          <div className="flex gap-4 flex-wrap">
            {(["upbeat", "chill", "mystic"] as VibeType[]).map((v) => (
              <label
                key={v}
                className={`flex items-center px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                  vibe === v
                    ? "border-purple-600 bg-purple-50 text-purple-900"
                    : "border-gray-200 hover:border-purple-300 text-purple-100"
                }`}
              >
                <input
                  type="radio"
                  name="vibe"
                  value={v}
                  checked={vibe === v}
                  onChange={(e) => setVibe(e.target.value as VibeType)}
                  className="sr-only"
                />
                <span className="text-lg font-bold capitalize text-purple-900">
                  {v === "upbeat" ? "🎉 Upbeat bounce" : v === "chill" ? "😌 Calm/mellow" : "✨ Mystic"}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Format Toggle */}
      <div>
        <fieldset>
          <legend className="block text-2xl font-bold text-purple-100 mb-2">Format</legend>
          <div className="flex gap-4">
            {(["song", "poem"] as FormatType[]).map((f) => (
              <label
                key={f}
                className={`flex-1 text-center px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                  format === f
                    ? "border-purple-600 bg-purple-50 text-purple-900"
                    : "border-gray-200 hover:border-purple-300 text-purple-100"
                }`}
              >
                <input
                  type="radio"
                  name="format"
                  value={f}
                  checked={format === f}
                  onChange={(e) => setFormat(e.target.value as FormatType)}
                  className="sr-only"
                />
                <span className="text-lg font-bold capitalize text-purple-900">
                  {f === "song" ? "🎵 Song" : "📜 Poem"}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </div>
  );
}
