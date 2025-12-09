export interface SavedVerse {
  id: string;
  verse: string;
  prompt: string;
  vibe: string;
  format: string;
  length: string;
  timestamp: number;
}

const STORAGE_KEY = "neurosong-favorites";

export function getFavorites(): SavedVerse[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading favorites:", error);
    return [];
  }
}

export function saveFavorite(verse: SavedVerse): void {
  if (typeof window === "undefined") return;
  
  try {
    const favorites = getFavorites();
    const updated = [verse, ...favorites];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving favorite:", error);
  }
}

export function removeFavorite(id: string): void {
  if (typeof window === "undefined") return;
  
  try {
    const favorites = getFavorites();
    const updated = favorites.filter((fav) => fav.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error removing favorite:", error);
  }
}

export function isFavorite(verseText: string): boolean {
  const favorites = getFavorites();
  return favorites.some((fav) => fav.verse === verseText);
}

export function generateVerseId(verse: string): string {
  return `${Date.now()}-${verse.substring(0, 20).replace(/\s/g, "-")}`;
}

