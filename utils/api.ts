export interface WeatherData {
  id: number;
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

const API_BASE_URL = "http://localhost:3001";

export const fetchWeatherData = async (): Promise<WeatherData[]> => {
  try {
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
    const response = await fetch(
      `${API_BASE_URL}/weather?city=${encodeURIComponent(cityName)}`
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
