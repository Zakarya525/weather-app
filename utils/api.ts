import { Platform } from "react-native";
import { getCachedData, isConnected, setCachedData } from "./networkAndCache";

// Function to get local IP address dynamically
const getLocalIPAddress = async (): Promise<string> => {
  try {
    // For web, always use localhost
    if (Platform.OS === "web") {
      return "localhost";
    }

    // For mobile, try a few common IPs quickly
    const commonIPs = [
      "192.168.1.11",
      "192.168.1.12",
      "192.168.0.1",
      "10.0.0.1",
    ];

    for (const ip of commonIPs) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const response = await fetch(`http://${ip}:3001/weather`, {
          signal: controller.signal,
          method: "GET",
        });

        clearTimeout(timeoutId);
        if (response.ok) {
          console.log(`Found working backend at: ${ip}`);
          return ip;
        }
      } catch (error) {
        // Continue to next IP
      }
    }

    // Fallback to the most likely IP
    console.warn("Could not detect working backend, using fallback IP");
    return "192.168.1.11";
  } catch (error) {
    console.warn("Error in IP detection, using fallback:", error);
    return "192.168.1.11";
  }
};

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
const getApiBaseUrl = async (): Promise<string> => {
  if (Platform.OS === "web") {
    return "http://localhost:3001";
  } else {
    // For mobile devices, dynamically detect the IP address
    const localIP = await getLocalIPAddress();
    return `http://${localIP}:3001`;
  }
};

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

    const apiBaseUrl = await getApiBaseUrl();
    console.log("Fetching from:", `${apiBaseUrl}/weather`);
    const response = await fetch(`${apiBaseUrl}/weather`);

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

    const apiBaseUrl = await getApiBaseUrl();
    const response = await fetch(
      `${apiBaseUrl}/weather?city=${encodeURIComponent(normalizedCityName)}`
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
