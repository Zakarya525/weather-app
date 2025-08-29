import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const RECENT_SEARCHES_KEY = "@weather_recent_searches";
const MAX_RECENT_SEARCHES = 8;

export interface RecentSearch {
  id: string;
  city: string;
  timestamp: number;
}

export const useRecentSearches = () => {
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [loading, setLoading] = useState(true);

  // Load recent searches from AsyncStorage
  const loadRecentSearches = useCallback(async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        const searches: RecentSearch[] = JSON.parse(stored);
        // Sort by timestamp descending (most recent first)
        const sortedSearches = searches.sort(
          (a, b) => b.timestamp - a.timestamp
        );
        setRecentSearches(sortedSearches);
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save recent searches to AsyncStorage
  const saveRecentSearches = useCallback(async (searches: RecentSearch[]) => {
    try {
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    } catch (error) {
      console.error("Error saving recent searches:", error);
    }
  }, []);

  // Add a new search to recent searches
  const addRecentSearch = useCallback(
    async (city: string) => {
      const normalizedCity = city.trim();
      if (!normalizedCity) return;

      const newSearch: RecentSearch = {
        id: `${normalizedCity.toLowerCase()}_${Date.now()}`,
        city: normalizedCity,
        timestamp: Date.now(),
      };

      setRecentSearches((prevSearches) => {
        // Remove any existing search for the same city (case-insensitive)
        const filteredSearches = prevSearches.filter(
          (search) => search.city.toLowerCase() !== normalizedCity.toLowerCase()
        );

        // Add the new search at the beginning
        const updatedSearches = [newSearch, ...filteredSearches];

        // Limit to MAX_RECENT_SEARCHES
        const limitedSearches = updatedSearches.slice(0, MAX_RECENT_SEARCHES);

        // Save to AsyncStorage
        saveRecentSearches(limitedSearches);

        return limitedSearches;
      });
    },
    [saveRecentSearches]
  );

  // Remove a specific search
  const removeRecentSearch = useCallback(
    async (searchId: string) => {
      setRecentSearches((prevSearches) => {
        const updatedSearches = prevSearches.filter(
          (search) => search.id !== searchId
        );
        saveRecentSearches(updatedSearches);
        return updatedSearches;
      });
    },
    [saveRecentSearches]
  );

  // Clear all recent searches
  const clearRecentSearches = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
      setRecentSearches([]);
    } catch (error) {
      console.error("Error clearing recent searches:", error);
    }
  }, []);

  // Load recent searches on mount
  useEffect(() => {
    loadRecentSearches();
  }, [loadRecentSearches]);

  return {
    recentSearches,
    loading,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
    refreshRecentSearches: loadRecentSearches,
  };
};
