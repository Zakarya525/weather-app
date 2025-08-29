import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { WeatherData } from "../utils/api";

interface FavoritesContextType {
  favorites: WeatherData[];
  loading: boolean;
  addToFavorites: (weather: WeatherData) => Promise<void>;
  removeFromFavorites: (cityId: number) => Promise<void>;
  isFavorite: (cityId: number) => boolean;
  clearAllFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

const FAVORITES_STORAGE_KEY = "@weather_app_favorites";

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const [favorites, setFavorites] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from AsyncStorage on app start
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavorites(parsedFavorites);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveFavorites = async (favoritesToSave: WeatherData[]) => {
    try {
      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(favoritesToSave)
      );
    } catch (error) {
      console.error("Error saving favorites:", error);
      throw new Error("Failed to save favorites");
    }
  };

  const addToFavorites = async (weather: WeatherData) => {
    try {
      const updatedFavorites = [...favorites, weather];
      setFavorites(updatedFavorites);
      await saveFavorites(updatedFavorites);
    } catch (error) {
      console.error("Error adding to favorites:", error);
      // Revert the state change on error
      setFavorites(favorites);
      throw error;
    }
  };

  const removeFromFavorites = async (cityId: number) => {
    try {
      const updatedFavorites = favorites.filter((fav) => fav.id !== cityId);
      setFavorites(updatedFavorites);
      await saveFavorites(updatedFavorites);
    } catch (error) {
      console.error("Error removing from favorites:", error);
      // Revert the state change on error
      setFavorites(favorites);
      throw error;
    }
  };

  const isFavorite = (cityId: number): boolean => {
    return favorites.some((fav) => fav.id === cityId);
  };

  const clearAllFavorites = async () => {
    try {
      setFavorites([]);
      await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing favorites:", error);
      throw new Error("Failed to clear favorites");
    }
  };

  const value: FavoritesContextType = {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearAllFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
