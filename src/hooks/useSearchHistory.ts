import { useCallback, useState, useEffect } from 'react';

export interface SearchResult {
  content: string;
  // Add any other result fields you need
  score?: number;
  metadata?: Record<string, any>;
}

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  results: SearchResult[];
}

const MAX_HISTORY_ITEMS = 20;
const CACHE_EXPIRY_HOURS = 24; // Cache results for 24 hours

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  // Load history from storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      // Filter out expired cache entries
      const now = Date.now();
      const filtered = parsed.filter((item: SearchHistoryItem) => {
        const age = now - item.timestamp;
        return age < CACHE_EXPIRY_HOURS * 60 * 60 * 1000;
      });
      setSearchHistory(filtered);
    }
  }, []);

  // Save history to storage whenever it changes
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const addToHistory = useCallback((query: string, results: SearchResult[]) => {
    if (!query.trim()) return;

    setSearchHistory((prev) => {
      // Remove any existing entries with the same query
      const filtered = prev.filter((item) => item.query !== query);

      // Add new entry at the start
      const newHistory = [
        { query, results, timestamp: Date.now() },
        ...filtered,
      ].slice(0, MAX_HISTORY_ITEMS); // Keep only most recent items

      return newHistory;
    });
  }, []);

  const findCachedResults = useCallback(
    (query: string): SearchResult[] | null => {
      const item = searchHistory.find((item) => item.query === query);
      if (!item) return null;

      // Check if cache is expired
      const age = Date.now() - item.timestamp;
      if (age > CACHE_EXPIRY_HOURS * 60 * 60 * 1000) {
        return null;
      }

      return item.results;
    },
    [searchHistory]
  );

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  const removeFromHistory = useCallback((query: string) => {
    setSearchHistory((prev) => prev.filter((item) => item.query !== query));
  }, []);

  return {
    searchHistory,
    addToHistory,
    clearHistory,
    removeFromHistory,
    findCachedResults,
  };
}
