/**
 * Modern Design System for Weather App
 * High-contrast, premium, accessible design tokens
 */

import { Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// COLORS - Modern, high-contrast palette
export const Colors = {
  // Primary Brand Colors
  primary: {
    50: "#EBF5FF",
    100: "#D1E9FF",
    200: "#A6D3FF",
    300: "#7AB8FF",
    400: "#4D9CFF",
    500: "#2081FF", // Main brand color
    600: "#1A6BDB",
    700: "#1454B7",
    800: "#0E3D93",
    900: "#08276F",
  },

  // Neutral Colors - High contrast
  neutral: {
    0: "#FFFFFF",
    50: "#FAFBFC",
    100: "#F4F6F8",
    200: "#E4E7EB",
    300: "#D1D6DB",
    400: "#9AA0A6",
    500: "#68737D",
    600: "#4F5B67",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
    950: "#0B0F1A",
  },

  // Semantic Colors
  success: {
    50: "#ECFDF5",
    500: "#10B981",
    600: "#059669",
    700: "#047857",
  },

  warning: {
    50: "#FFFBEB",
    500: "#F59E0B",
    600: "#D97706",
    700: "#B45309",
  },

  error: {
    50: "#FEF2F2",
    500: "#EF4444",
    600: "#DC2626",
    700: "#B91C1C",
  },

  // Weather-specific colors (enhanced)
  weather: {
    sunny: {
      primary: "#FF8C42",
      secondary: "#FFB366",
      background: "linear-gradient(135deg, #FFE066, #FF8C42)",
      text: "#8B4513",
    },
    cloudy: {
      primary: "#6B7280",
      secondary: "#9CA3AF",
      background: "linear-gradient(135deg, #E5E7EB, #9CA3AF)",
      text: "#374151",
    },
    rainy: {
      primary: "#3B82F6",
      secondary: "#60A5FA",
      background: "linear-gradient(135deg, #BFDBFE, #3B82F6)",
      text: "#1E3A8A",
    },
    snowy: {
      primary: "#E0E7FF",
      secondary: "#C7D2FE",
      background: "linear-gradient(135deg, #F8FAFC, #E0E7FF)",
      text: "#1E293B",
    },
    partlyCloudy: {
      primary: "#06B6D4",
      secondary: "#67E8F9",
      background: "linear-gradient(135deg, #CFFAFE, #06B6D4)",
      text: "#0E7490",
    },
  },
};

// TYPOGRAPHY - Modern type scale
export const Typography = {
  // Font families
  fontFamily: {
    regular: "System",
    medium: "System",
    semiBold: "System",
    bold: "System",
  },

  // Font weights
  fontWeight: {
    regular: "400" as const,
    medium: "500" as const,
    semiBold: "600" as const,
    bold: "700" as const,
  },

  // Font sizes - Responsive scale
  fontSize: {
    xs: Math.max(12, screenWidth * 0.03),
    sm: Math.max(14, screenWidth * 0.035),
    base: Math.max(16, screenWidth * 0.04),
    lg: Math.max(18, screenWidth * 0.045),
    xl: Math.max(20, screenWidth * 0.05),
    "2xl": Math.max(24, screenWidth * 0.06),
    "3xl": Math.max(30, screenWidth * 0.075),
    "4xl": Math.max(36, screenWidth * 0.09),
    "5xl": Math.max(48, screenWidth * 0.12),
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
};

// SPACING - 8pt grid system
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  "4xl": 48,
  "5xl": 64,
  "6xl": 80,

  // Responsive spacing
  responsive: {
    xs: Math.max(4, screenWidth * 0.01),
    sm: Math.max(8, screenWidth * 0.02),
    md: Math.max(12, screenWidth * 0.03),
    base: Math.max(16, screenWidth * 0.04),
    lg: Math.max(20, screenWidth * 0.05),
    xl: Math.max(24, screenWidth * 0.06),
    "2xl": Math.max(32, screenWidth * 0.08),
    "3xl": Math.max(40, screenWidth * 0.1),
  },
};

// BORDER RADIUS - Modern, consistent radii
export const BorderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  full: 9999,
};

// SHADOWS - Layered, modern shadows
export const Shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  sm: {
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  base: {
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  md: {
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },

  lg: {
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },

  xl: {
    shadowColor: Colors.neutral[900],
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },

  // Colored shadows for weather themes
  weather: {
    sunny: {
      shadowColor: Colors.weather.sunny.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 6,
    },
    rainy: {
      shadowColor: Colors.weather.rainy.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 6,
    },
    cloudy: {
      shadowColor: Colors.weather.cloudy.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 6,
    },
  },
};

// ANIMATIONS - Smooth, premium motion
export const Animations = {
  timing: {
    fast: 150,
    normal: 250,
    slow: 350,
    slower: 500,
  },

  easing: {
    easeOut: "ease-out",
    easeIn: "ease-in",
    easeInOut: "ease-in-out",
    spring: "spring",
  },

  // Spring configurations
  spring: {
    gentle: {
      damping: 15,
      stiffness: 120,
    },
    bouncy: {
      damping: 10,
      stiffness: 100,
    },
    snappy: {
      damping: 20,
      stiffness: 300,
    },
  },
};

// GLASS MORPHISM - Modern glassmorphism effects
export const GlassMorphism = {
  light: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(20px)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },

  medium: {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(30px)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },

  dark: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(20px)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
};

// COMPONENT STYLES - Reusable component patterns
export const Components = {
  card: {
    primary: {
      backgroundColor: Colors.neutral[0],
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      ...Shadows.base,
    },

    glass: {
      ...GlassMorphism.light,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      ...Shadows.md,
    },

    elevated: {
      backgroundColor: Colors.neutral[0],
      borderRadius: BorderRadius.xl,
      padding: Spacing.xl,
      ...Shadows.lg,
    },
  },

  button: {
    primary: {
      backgroundColor: Colors.primary[500],
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      ...Shadows.sm,
    },

    secondary: {
      backgroundColor: Colors.neutral[100],
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderWidth: 1,
      borderColor: Colors.neutral[200],
    },

    ghost: {
      backgroundColor: "transparent",
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
    },
  },

  input: {
    default: {
      backgroundColor: Colors.neutral[50],
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: Colors.neutral[200],
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.base,
      fontSize: Typography.fontSize.base,
    },

    focused: {
      borderColor: Colors.primary[500],
      ...Shadows.sm,
    },
  },
};

// LAYOUT - Consistent layout patterns
export const Layout = {
  screenPadding: Spacing.responsive.base,
  cardMargin: Spacing.responsive.base,
  sectionSpacing: Spacing.responsive["2xl"],

  // Safe areas
  safeArea: {
    paddingTop: Math.max(20, screenHeight * 0.025),
    paddingBottom: Math.max(20, screenHeight * 0.025),
  },

  // Container sizes
  container: {
    maxWidth: Math.min(screenWidth, 400),
    padding: Spacing.responsive.base,
  },
};

// ACCESSIBILITY - WCAG compliant settings
export const Accessibility = {
  // Minimum touch target size (44pt)
  touchTarget: {
    minHeight: 44,
    minWidth: 44,
  },

  // Text contrast ratios
  contrast: {
    normal: 4.5, // WCAG AA
    large: 3.0, // WCAG AA for large text
    enhanced: 7.0, // WCAG AAA
  },

  // Focus indicators
  focus: {
    borderWidth: 2,
    borderColor: Colors.primary[500],
    borderRadius: BorderRadius.sm,
  },
};
