import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

const CACHE_EXPIRATION = 60 * 60 * 1000; // 1 hour in milliseconds
const CACHE_PREFIX = "weather_cache_";

export interface CacheItem {
  data: any;
  timestamp: number;
}

export const isConnected = async (): Promise<boolean> => {
  const netInfo = await NetInfo.fetch();
  return netInfo.isConnected ?? false;
};

export const setCachedData = async (key: string, data: any): Promise<void> => {
  try {
    const cacheItem: CacheItem = {
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(
      `${CACHE_PREFIX}${key}`,
      JSON.stringify(cacheItem)
    );
  } catch (error) {
    console.error("Error caching data:", error);
  }
};

export const getCachedData = async (key: string): Promise<any | null> => {
  try {
    const cachedItem = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!cachedItem) return null;

    const { data, timestamp }: CacheItem = JSON.parse(cachedItem);
    const now = Date.now();

    // Check if cache is expired
    if (now - timestamp > CACHE_EXPIRATION) {
      await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error retrieving cached data:", error);
    return null;
  }
};

export const clearCache = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const weatherCacheKeys = keys.filter((key) => key.startsWith(CACHE_PREFIX));
    await AsyncStorage.multiRemove(weatherCacheKeys);
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
};

export const getCacheAge = async (key: string): Promise<number | null> => {
  try {
    const cachedItem = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!cachedItem) return null;

    const { timestamp }: CacheItem = JSON.parse(cachedItem);
    return Date.now() - timestamp;
  } catch (error) {
    console.error("Error getting cache age:", error);
    return null;
  }
};
