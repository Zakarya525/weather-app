import { Shadows, Spacing } from "@/constants/DesignSystem";
import { useTheme } from "@/contexts/ThemeContext";
import { BlurView } from "expo-blur";
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
    outputRange: [1, 0.98, 0.95],
    extrapolate: "clamp",
  });

  const shadowOpacity = scrollY.interpolate({
    inputRange: [0, blurThreshold / 2, blurThreshold],
    outputRange: [0, 0.06, 0.15],
    extrapolate: "clamp",
  });

  const borderOpacity = scrollY.interpolate({
    inputRange: [0, blurThreshold / 3, blurThreshold],
    outputRange: [0.03, 0.15, 0.3],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.headerContainer,
        {
          paddingTop:
            Platform.OS === "ios"
              ? insets.top + 12
              : (StatusBar.currentHeight || 0) + 16,
          opacity: headerOpacity,
        },
        style,
      ]}
    >
      {/* Blur Effect Background */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            overflow: "hidden",
          },
        ]}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              opacity: scrollY.interpolate({
                inputRange: [0, blurThreshold / 2, blurThreshold],
                outputRange: [0, 0.25, 0.4],
                extrapolate: "clamp",
              }),
            },
          ]}
        >
          <BlurView
            intensity={40}
            tint={isDarkActive ? "dark" : "light"}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
      </Animated.View>

      {/* Primary Background with Transparency */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: backgroundColor || colors.background.card,
            opacity: scrollY.interpolate({
              inputRange: [0, blurThreshold / 4],
              outputRange: [0.75, 0.9],
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
              ? "rgba(28, 28, 30, 0.15)"
              : "rgba(255, 255, 255, 0.15)",
            opacity: scrollY.interpolate({
              inputRange: [0, blurThreshold / 2],
              outputRange: [0, 0.5],
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
              ? "rgba(0, 0, 0, 0.02)"
              : "rgba(0, 0, 0, 0.008)",
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
            ...Shadows.md,
            shadowOpacity,
          },
        ]}
      />

      {/* Animated Border */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            borderBottomWidth: 0.5,
            borderBottomColor: colors.border.primary,
            opacity: borderOpacity,
          },
        ]}
      />

      {/* Content */}
      <Animated.View style={[styles.contentContainer]}>
        {children}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: "relative",
    paddingVertical: Spacing.responsive.md,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    elevation: 8,
    overflow: "visible",
    ...(Platform.OS === "android" && {
      minHeight: 80,
      paddingBottom: Spacing.responsive.sm,
    }),
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
    paddingBottom: Platform.OS === "android" ? Spacing.sm : 0,
    ...(Platform.OS === "android" && {
      minHeight: 60,
    }),
  },
});
