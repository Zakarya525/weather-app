import { Platform } from "react-native";
import { getCachedData, isConnected, setCachedData } from "./networkAndCache";

export interface WeatherData {
  id: number;
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

// Use different URLs for different platforms
const getApiBaseUrl = () => {
  if (Platform.OS === "web") {
    return "http://localhost:3001";
  } else {
    // For mobile devices, use your computer's IP address
    return "http://192.168.1.12:3001";
  }
};

const API_BASE_URL = getApiBaseUrl();

// Helper function to capitalize first letter
const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const fetchWeatherData = async (): Promise<WeatherData[]> => {
  try {
    // Check for cached data first
    const cachedData = await getCachedData("all_weather");
    const connected = await isConnected();

    if (!connected) {
      if (cachedData) {
        console.log("Offline: Using cached weather data");
        return cachedData;
      }
      throw new Error("No internet connection and no cached data available");
    }

    console.log("Fetching from:", `${API_BASE_URL}/weather`);
    const response = await fetch(`${API_BASE_URL}/weather`);

    if (!response.ok) {
      if (cachedData) {
        console.log("Failed to fetch: Using cached weather data");
        return cachedData;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // Cache the new data
    await setCachedData("all_weather", data);
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw new Error(
      "Failed to fetch weather data. Please check your connection."
    );
  }
};

export const fetchWeatherByCity = async (
  cityName: string
): Promise<WeatherData | null> => {
  try {
    // Normalize city name: capitalize first letter, lowercase the rest
    const normalizedCityName = capitalizeFirstLetter(cityName.trim());
    console.log("Searching for:", normalizedCityName);

    // Check for cached data first
    const cachedData = await getCachedData(`city_${normalizedCityName}`);
    const connected = await isConnected();

    if (!connected) {
      if (cachedData) {
        console.log(`Offline: Using cached data for ${normalizedCityName}`);
        return cachedData;
      }
      throw new Error("No internet connection and no cached data available");
    }

    const response = await fetch(
      `${API_BASE_URL}/weather?city=${encodeURIComponent(normalizedCityName)}`
    );

    if (!response.ok) {
      if (cachedData) {
        console.log(
          `Failed to fetch: Using cached data for ${normalizedCityName}`
        );
        return cachedData;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const weatherData = data[0] || null;

    if (weatherData) {
      // Cache the new data
      await setCachedData(`city_${normalizedCityName}`, weatherData);
    }

    return weatherData;
  } catch (error) {
    console.error(`Error fetching weather for ${cityName}:`, error);
    throw new Error(
      `Failed to fetch weather data for ${cityName}. Please check your connection.`
    );
  }
};
