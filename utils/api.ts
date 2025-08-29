import { Platform } from "react-native";

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
    console.log("Fetching from:", `${API_BASE_URL}/weather`);
    const response = await fetch(`${API_BASE_URL}/weather`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
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

    const response = await fetch(
      `${API_BASE_URL}/weather?city=${encodeURIComponent(normalizedCityName)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error(`Error fetching weather for ${cityName}:`, error);
    throw new Error(
      `Failed to fetch weather data for ${cityName}. Please check your connection.`
    );
  }
};
