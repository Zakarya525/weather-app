/**
 * Accessibility utilities for ensuring proper contrast and usability
 */

// Calculate relative luminance of a color (simplified version)
export const getLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const [r, g, b] = rgb.map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// Convert hex color to RGB
export const hexToRgb = (hex: string): number[] | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null;
};

// Calculate contrast ratio between two colors
export const getContrastRatio = (color1: string, color2: string): number => {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
};

// Check if contrast ratio meets WCAG AA standards
export const meetsContrastStandard = (
  backgroundColor: string,
  textColor: string
): boolean => {
  const ratio = getContrastRatio(backgroundColor, textColor);
  return ratio >= 4.5; // WCAG AA standard for normal text
};

// Get accessible text color for a given background
export const getAccessibleTextColor = (backgroundColor: string): string => {
  const luminance = getLuminance(backgroundColor);
  return luminance > 0.5 ? "#2C3E50" : "#FFFFFF";
};

// Ensure minimum contrast for text on background
export const ensureAccessibleContrast = (
  backgroundColor: string,
  preferredTextColor: string
): string => {
  if (meetsContrastStandard(backgroundColor, preferredTextColor)) {
    return preferredTextColor;
  }
  return getAccessibleTextColor(backgroundColor);
};

// Accessibility labels for weather conditions
export const getWeatherAccessibilityLabel = (
  condition: string,
  temperature: number
): string => {
  const tempUnit = "°C"; // Could be made dynamic based on user preference
  return `Weather condition: ${condition}, Temperature: ${temperature}${tempUnit}`;
};

// Generate accessibility hint for weather cards
export const getWeatherCardAccessibilityHint = (
  cityName: string,
  condition: string
): string => {
  return `Tap to view detailed weather information for ${cityName}. Current condition: ${condition}`;
};

// Screen reader friendly weather description
export const getWeatherDescription = (weather: {
  city: string;
  condition: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
}): string => {
  return `${weather.city}: ${weather.condition}, ${weather.temperature} degrees Celsius, humidity ${weather.humidity} percent, wind speed ${weather.windSpeed} kilometers per hour`;
};
