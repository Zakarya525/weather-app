import { Shadows, Spacing } from "@/constants/DesignSystem";
import { useTheme } from "@/contexts/ThemeContext";
import { ReactNode } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: screenWidth } = Dimensions.get("window");

interface BlurHeaderProps {
  children: ReactNode;
  scrollY: Animated.Value;
  blurThreshold?: number;
  backgroundColor?: string;
  style?: any;
}

export default function BlurHeader({
  children,
  scrollY,
  blurThreshold = 20,
  backgroundColor,
  style,
}: BlurHeaderProps) {
  const { colors, isDarkActive } = useTheme();
  const insets = useSafeAreaInsets();

  // Animated values for effects
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, blurThreshold / 2, blurThreshold],
    outputRange: [1, 0.97, 0.9],
    extrapolate: "clamp",
  });

  const shadowOpacity = scrollY.interpolate({
    inputRange: [0, blurThreshold / 2, blurThreshold],
    outputRange: [0, 0.08, 0.2],
    extrapolate: "clamp",
  });

  const borderOpacity = scrollY.interpolate({
    inputRange: [0, blurThreshold / 3, blurThreshold],
    outputRange: [0.05, 0.2, 0.4],
    extrapolate: "clamp",
  });

  const scaleEffect = scrollY.interpolate({
    inputRange: [0, blurThreshold],
    outputRange: [1, 0.98],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.headerContainer,
        {
          paddingTop:
            Platform.OS === "ios"
              ? insets.top + 20
              : (StatusBar.currentHeight || 0) + 20,
          opacity: headerOpacity,
        },
        style,
      ]}
    >
      {/* Primary Background */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: backgroundColor || colors.background.card,
            opacity: scrollY.interpolate({
              inputRange: [0, blurThreshold / 4],
              outputRange: [1, 0.95],
              extrapolate: "clamp",
            }),
          },
        ]}
      />

      {/* Glass Morphism Overlay */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: isDarkActive
              ? "rgba(28, 28, 30, 0.3)"
              : "rgba(255, 255, 255, 0.3)",
            opacity: scrollY.interpolate({
              inputRange: [0, blurThreshold / 2],
              outputRange: [0, 0.8],
              extrapolate: "clamp",
            }),
          },
        ]}
      />

      {/* Subtle Depth Overlay */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: isDarkActive
              ? "rgba(0, 0, 0, 0.05)"
              : "rgba(0, 0, 0, 0.02)",
            opacity: scrollY.interpolate({
              inputRange: [0, blurThreshold],
              outputRange: [0, 1],
              extrapolate: "clamp",
            }),
          },
        ]}
      />

      {/* Animated Shadow */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            ...Shadows.lg,
            shadowOpacity,
          },
        ]}
      />

      {/* Animated Border */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            borderBottomWidth: 1,
            borderBottomColor: colors.border.primary,
            opacity: borderOpacity,
          },
        ]}
      />

      {/* Content */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            transform: [{ scale: scaleEffect }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: "relative",
    paddingVertical: Spacing.responsive.lg,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    elevation: 10,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: Math.max(20, screenWidth * 0.05),
  },
});
