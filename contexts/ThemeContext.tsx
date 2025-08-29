import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Animated, Appearance } from "react-native";
import { Colors as BaseColors } from "../constants/DesignSystem";

export type ThemeMode = "light" | "dark" | "auto";
export type ActiveTheme = "light" | "dark";

// Extended color schemes for light and dark themes
export const ThemeColors = {
  light: {
    // Background colors
    background: {
      primary: BaseColors.neutral[0], // Pure white
      secondary: BaseColors.neutral[50], // Very light gray
      tertiary: BaseColors.neutral[100], // Light gray
      card: BaseColors.neutral[0], // White cards
      elevated: BaseColors.neutral[0], // White elevated surfaces
    },
    // Text colors
    text: {
      primary: BaseColors.neutral[900], // Almost black
      secondary: BaseColors.neutral[700], // Dark gray
      tertiary: BaseColors.neutral[500], // Medium gray
      inverse: BaseColors.neutral[0], // White text for dark backgrounds
    },
    // Border colors
    border: {
      primary: BaseColors.neutral[200], // Light border
      secondary: BaseColors.neutral[300], // Medium light border
      focus: BaseColors.primary[500], // Blue focus border
    },
    // Icon colors
    icon: {
      primary: BaseColors.neutral[700], // Dark gray icons
      secondary: BaseColors.neutral[500], // Medium gray icons
      accent: BaseColors.primary[500], // Blue accent icons
    },
    // Status colors remain the same
    status: {
      success: BaseColors.success[500],
      warning: BaseColors.warning[500],
      error: BaseColors.error[500],
    },
    // Glass morphism for light theme
    glass: {
      background: "rgba(255, 255, 255, 0.8)",
      border: "rgba(255, 255, 255, 0.2)",
    },
  },
  dark: {
    // Background colors
    background: {
      primary: BaseColors.neutral[950], // Almost black
      secondary: BaseColors.neutral[900], // Very dark gray
      tertiary: BaseColors.neutral[800], // Dark gray
      card: BaseColors.neutral[900], // Dark cards
      elevated: BaseColors.neutral[800], // Elevated dark surfaces
    },
    // Text colors
    text: {
      primary: BaseColors.neutral[50], // Almost white
      secondary: BaseColors.neutral[300], // Light gray
      tertiary: BaseColors.neutral[400], // Medium light gray
      inverse: BaseColors.neutral[900], // Dark text for light backgrounds
    },
    // Border colors
    border: {
      primary: BaseColors.neutral[700], // Dark border
      secondary: BaseColors.neutral[600], // Medium dark border
      focus: BaseColors.primary[500], // Blue focus for dark theme
    },
    // Icon colors
    icon: {
      primary: BaseColors.neutral[300], // Light gray icons
      secondary: BaseColors.neutral[400], // Medium light gray icons
      accent: BaseColors.primary[500], // Blue accent icons for dark theme
    },
    // Status colors adjusted for dark theme
    status: {
      success: BaseColors.success[500],
      warning: BaseColors.warning[500],
      error: BaseColors.error[500],
    },
    // Glass morphism for dark theme
    glass: {
      background: "rgba(0, 0, 0, 0.6)",
      border: "rgba(255, 255, 255, 0.1)",
    },
  },
};

// Shadow configurations for different themes
export const ThemeShadows = {
  light: {
    shadowColor: BaseColors.neutral[900],
    shadowOpacity: 0.1,
  },
  dark: {
    shadowColor: BaseColors.neutral[950],
    shadowOpacity: 0.3,
  },
};

interface ThemeContextType {
  // Current theme state
  mode: ThemeMode;
  activeTheme: ActiveTheme;
  colors: typeof ThemeColors.light;
  shadows: typeof ThemeShadows.light;

  // Theme control functions
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;

  // Animation values for smooth transitions
  themeTransition: Animated.Value;

  // Utility functions
  isAutoMode: boolean;
  isDarkActive: boolean;
  isLightActive: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "@theme_preference";

// Time-based theme detection
const getTimeBasedTheme = (): ActiveTheme => {
  const hour = new Date().getHours();
  // 6 AM (6) to 6 PM (18) = light theme
  // 6 PM (18) to 6 AM (6) = dark theme
  return hour >= 6 && hour < 18 ? "light" : "dark";
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<ThemeMode>("auto");
  const [activeTheme, setActiveTheme] = useState<ActiveTheme>("light");
  const [isInitialized, setIsInitialized] = useState(false);
  const themeTransition = useState(new Animated.Value(0))[0];

  // Load saved theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedMode && ["light", "dark", "auto"].includes(savedMode)) {
          setMode(savedMode as ThemeMode);
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadThemePreference();
  }, []);

  // Update active theme based on mode and time
  useEffect(() => {
    let timeInterval: ReturnType<typeof setInterval>;

    const updateActiveTheme = () => {
      let newTheme: ActiveTheme;

      switch (mode) {
        case "light":
          newTheme = "light";
          break;
        case "dark":
          newTheme = "dark";
          break;
        case "auto":
          newTheme = getTimeBasedTheme();
          break;
        default:
          newTheme = "light";
      }

      if (newTheme !== activeTheme) {
        setActiveTheme(newTheme);

        // Animate theme transition
        Animated.timing(themeTransition, {
          toValue: newTheme === "dark" ? 1 : 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    };

    // Update immediately
    updateActiveTheme();

    // Set up interval to check time-based theme changes (check every minute)
    if (mode === "auto") {
      timeInterval = setInterval(updateActiveTheme, 60000);
    }

    return () => {
      if (timeInterval) {
        clearInterval(timeInterval);
      }
    };
  }, [mode, activeTheme, themeTransition]);

  // Listen to system theme changes when in auto mode
  useEffect(() => {
    if (mode === "auto") {
      const subscription = Appearance.addChangeListener(() => {
        // Force update when system appearance changes
        const newTheme = getTimeBasedTheme();
        if (newTheme !== activeTheme) {
          setActiveTheme(newTheme);

          Animated.timing(themeTransition, {
            toValue: newTheme === "dark" ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
          }).start();
        }
      });

      return () => subscription.remove();
    }
  }, [mode, activeTheme, themeTransition]);

  // Save theme preference
  const setThemeMode = async (newMode: ThemeMode) => {
    setMode(newMode);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, newMode);
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

  // Toggle between light and dark (switches to manual mode)
  const toggleTheme = async () => {
    const newTheme = activeTheme === "light" ? "dark" : "light";
    await setThemeMode(newTheme);
  };

  // Get current theme colors and shadows
  const colors = ThemeColors[activeTheme];
  const shadows = ThemeShadows[activeTheme];

  // Utility computed values
  const isAutoMode = mode === "auto";
  const isDarkActive = activeTheme === "dark";
  const isLightActive = activeTheme === "light";

  // Don't render children until theme is initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        mode,
        activeTheme,
        colors,
        shadows,
        setThemeMode,
        toggleTheme,
        themeTransition,
        isAutoMode,
        isDarkActive,
        isLightActive,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Utility hook for animated theme values
export const useAnimatedTheme = () => {
  const { themeTransition, colors } = useTheme();

  return {
    themeTransition,
    animatedBackgroundColor: themeTransition.interpolate({
      inputRange: [0, 1],
      outputRange: [
        ThemeColors.light.background.primary,
        ThemeColors.dark.background.primary,
      ],
    }),
    animatedTextColor: themeTransition.interpolate({
      inputRange: [0, 1],
      outputRange: [
        ThemeColors.light.text.primary,
        ThemeColors.dark.text.primary,
      ],
    }),
    colors,
  };
};
