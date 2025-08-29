export interface WeatherTheme {
  name: string;
  gradientColors: string[];
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  iconColor: string;
  cardBackgroundColor: string;
  shadowColor: string;
}

export interface WeatherColorScheme {
  [key: string]: WeatherTheme;
}

// Import design system

export const weatherThemes: WeatherColorScheme = {
  sunny: {
    name: "Sunny",
    gradientColors: ["#FFF7E6", "#FFE066", "#FF8C42"],
    primaryColor: "#FF8C42",
    secondaryColor: "#FFB366",
    textColor: "#8B4513", // High contrast brown
    iconColor: "#FF8C42",
    cardBackgroundColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "rgba(255, 140, 66, 0.3)",
  },
  cloudy: {
    name: "Cloudy",
    gradientColors: ["#F8F9FA", "#E5E7EB", "#9CA3AF"],
    primaryColor: "#6B7280",
    secondaryColor: "#9CA3AF",
    textColor: "#111827", // High contrast dark
    iconColor: "#6B7280",
    cardBackgroundColor: "rgba(255, 255, 255, 0.92)",
    shadowColor: "rgba(107, 114, 128, 0.25)",
  },
  "partly cloudy": {
    name: "Partly Cloudy",
    gradientColors: ["#F0F9FF", "#BFDBFE", "#60A5FA"],
    primaryColor: "#3B82F6",
    secondaryColor: "#60A5FA",
    textColor: "#1E3A8A", // High contrast blue
    iconColor: "#3B82F6",
    cardBackgroundColor: "rgba(255, 255, 255, 0.93)",
    shadowColor: "rgba(59, 130, 246, 0.25)",
  },
  rainy: {
    name: "Rainy",
    gradientColors: ["#EBF8FF", "#93C5FD", "#3B82F6"],
    primaryColor: "#2563EB",
    secondaryColor: "#3B82F6",
    textColor: "#1E3A8A", // High contrast blue
    iconColor: "#2563EB",
    cardBackgroundColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "rgba(37, 99, 235, 0.3)",
  },
  snowy: {
    name: "Snowy",
    gradientColors: ["#FFFFFF", "#F8FAFC", "#E2E8F0"],
    primaryColor: "#64748B",
    secondaryColor: "#94A3B8",
    textColor: "#0F172A", // High contrast dark
    iconColor: "#64748B",
    cardBackgroundColor: "rgba(255, 255, 255, 0.98)",
    shadowColor: "rgba(100, 116, 139, 0.2)",
  },
  humid: {
    name: "Humid",
    gradientColors: ["#ECFDF5", "#A7F3D0", "#34D399"],
    primaryColor: "#059669",
    secondaryColor: "#10B981",
    textColor: "#064E3B", // High contrast green
    iconColor: "#059669",
    cardBackgroundColor: "rgba(255, 255, 255, 0.94)",
    shadowColor: "rgba(5, 150, 105, 0.25)",
  },
};

export const getWeatherTheme = (condition: string): WeatherTheme => {
  const normalizedCondition = condition.toLowerCase().trim();

  // Handle various weather condition mappings
  if (normalizedCondition.includes("snow")) {
    return weatherThemes.snowy;
  }
  if (
    normalizedCondition.includes("rain") ||
    normalizedCondition.includes("drizzle")
  ) {
    return weatherThemes.rainy;
  }
  if (normalizedCondition.includes("cloud")) {
    if (
      normalizedCondition.includes("partly") ||
      normalizedCondition.includes("partial")
    ) {
      return weatherThemes["partly cloudy"];
    }
    return weatherThemes.cloudy;
  }
  if (
    normalizedCondition.includes("sun") ||
    normalizedCondition.includes("clear")
  ) {
    return weatherThemes.sunny;
  }
  if (
    normalizedCondition.includes("humid") ||
    normalizedCondition.includes("fog")
  ) {
    return weatherThemes.humid;
  }

  // Default fallback
  return weatherThemes["partly cloudy"];
};

export const getWeatherIconName = (condition: string): string => {
  const normalizedCondition = condition.toLowerCase().trim();

  if (normalizedCondition.includes("snow")) {
    return "weather-snowy";
  }
  if (
    normalizedCondition.includes("rain") ||
    normalizedCondition.includes("drizzle")
  ) {
    return "weather-rainy";
  }
  if (normalizedCondition.includes("cloud")) {
    if (
      normalizedCondition.includes("partly") ||
      normalizedCondition.includes("partial")
    ) {
      return "weather-partly-cloudy";
    }
    return "weather-cloudy";
  }
  if (
    normalizedCondition.includes("sun") ||
    normalizedCondition.includes("clear")
  ) {
    return "weather-sunny";
  }
  if (
    normalizedCondition.includes("humid") ||
    normalizedCondition.includes("fog")
  ) {
    return "weather-fog";
  }

  return "weather-partly-cloudy";
};

// Import accessibility utilities
import { ensureAccessibleContrast } from "./accessibility";

// Utility function to ensure proper contrast
export const ensureContrast = (
  backgroundColor: string,
  textColor: string
): string => {
  return ensureAccessibleContrast(backgroundColor, textColor);
};

// Get accessible theme colors
export const getAccessibleWeatherTheme = (condition: string): WeatherTheme => {
  const theme = getWeatherTheme(condition);

  // Force high contrast text colors for better visibility
  // Always use dark text on light backgrounds for maximum contrast
  const accessibleTextColor = "#111827"; // Always use dark text

  return {
    ...theme,
    textColor: accessibleTextColor,
  };
};

// Animation duration constants
export const ANIMATION_DURATION = 300;
export const TRANSITION_DELAY = 100;
