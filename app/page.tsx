"use client";

import { useState, useEffect } from "react";
import { PromptCard } from "@/components/PromptCard";
import { Header } from "@/components/Header";
import { SavedVersesCard } from "@/components/SavedVersesCard";
import { getFavorites, removeFavorite, type SavedVerse } from "@/lib/favorites";

export default function Home() {
  const [showSaved, setShowSaved] = useState(false);
  const [savedVerses, setSavedVerses] = useState<SavedVerse[]>([]);

  useEffect(() => {
    setSavedVerses(getFavorites());
  }, [showSaved]); // Refresh when toggling view

  const handleToggleSaved = () => {
    setShowSaved(!showSaved);
    if (!showSaved) {
      setSavedVerses(getFavorites());
    }
  };

  const handleRemoveFavorite = (id: string) => {
    removeFavorite(id);
    setSavedVerses(getFavorites());
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-pink-500/20 blur-3xl" />
        <div className="absolute top-24 right-4 h-96 w-96 rounded-full bg-indigo-600/30 blur-[120px]" />
        <div className="absolute bottom-0 left-10 h-64 w-64 rounded-full bg-blue-500/30 blur-[100px]" />
      </div>
      <div className="relative z-10">
        <Header
          onToggleSaved={handleToggleSaved}
          showingSaved={showSaved}
          savedCount={savedVerses.length}
        />
        <div className="container mx-auto max-w-5xl px-6 py-12 space-y-8">
          {showSaved ? (
            <SavedVersesCard
              verses={savedVerses}
              onRemove={handleRemoveFavorite}
            />
          ) : (
            <PromptCard />
          )}
        </div>
      </div>
    </main>
  );
}
