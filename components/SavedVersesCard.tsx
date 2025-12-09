"use client";

import type { SavedVerse } from "@/lib/favorites";

interface SavedVersesCardProps {
  verses: SavedVerse[];
  onRemove: (id: string) => void;
}

export function SavedVersesCard({ verses, onRemove }: SavedVersesCardProps) {
  if (verses.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
        <p className="text-gray-500 text-lg">💭 No saved verses yet</p>
        <p className="text-gray-400 text-sm mt-2">
          Heart your favorite verses to save them here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        ❤️ Saved Favorites ({verses.length})
      </h2>
      {verses.map((saved) => (
        <div
          key={saved.id}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                {saved.vibe} {saved.format} • {saved.length}
              </span>
              <p className="text-sm text-gray-400 mt-2">
                {new Date(saved.timestamp).toLocaleDateString()} at{" "}
                {new Date(saved.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => onRemove(saved.id)}
              className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
              aria-label="Remove from favorites"
            >
              🗑️
            </button>
          </div>

          {saved.prompt && (
              <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 font-medium mb-1">Prompt:</p>
              <p className="text-sm text-gray-700">{saved.prompt}</p>
            </div>
          )}

          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-line text-gray-800 leading-relaxed">
              {saved.verse.split("\n").map((line, idx) => (
                <p key={idx} className={line.trim() === "" ? "h-4" : ""}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
