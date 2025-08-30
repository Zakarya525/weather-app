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

  const blurOpacity = scrollY.interpolate({
    inputRange: [0, blurThreshold / 2, blurThreshold],
    outputRange: [0.4, 0.7, 0.9],
    extrapolate: "clamp",
  });

  const shadowOpacity = scrollY.interpolate({
    inputRange: [0, blurThreshold / 2, blurThreshold],
    outputRange: [0, 0.1, 0.25],
    extrapolate: "clamp",
  });

  const borderOpacity = scrollY.interpolate({
    inputRange: [0, blurThreshold / 3, blurThreshold],
    outputRange: [0.05, 0.2, 0.4],
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
      {/* Main Blur Effect */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            overflow: "hidden",
          },
        ]}
        pointerEvents="none"
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              opacity: blurOpacity,
            },
          ]}
        >
          <BlurView
            intensity={120}
            tint={isDarkActive ? "dark" : "light"}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
      </Animated.View>

      {/* Frosted Glass Overlay */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: isDarkActive
              ? "rgba(28, 28, 30, 0.3)"
              : "rgba(255, 255, 255, 0.4)",
            opacity: scrollY.interpolate({
              inputRange: [0, blurThreshold / 2],
              outputRange: [0.5, 0.8],
              extrapolate: "clamp",
            }),
          },
        ]}
        pointerEvents="none"
      />

      {/* Subtle Depth Layer */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: isDarkActive
              ? "rgba(0, 0, 0, 0.1)"
              : "rgba(0, 0, 0, 0.05)",
            opacity: scrollY.interpolate({
              inputRange: [0, blurThreshold],
              outputRange: [0, 1],
              extrapolate: "clamp",
            }),
          },
        ]}
        pointerEvents="none"
      />

      {/* Enhanced Shadow */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            ...Shadows.lg,
            shadowOpacity,
            shadowRadius: 25,
            elevation: 15,
          },
        ]}
        pointerEvents="none"
      />

      {/* Subtle Border */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            borderBottomWidth: 1,
            borderBottomColor: isDarkActive
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)",
            opacity: borderOpacity,
          },
        ]}
        pointerEvents="none"
      />

      {/* Content */}
      <Animated.View style={[styles.contentContainer]} pointerEvents="box-none">
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
    elevation: 15,
    overflow: "visible",
    ...(Platform.OS === "android" && {
      minHeight: 80,
      paddingBottom: Spacing.responsive.sm,
      paddingTop: Spacing.responsive.md + 5,
    }),
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
    paddingBottom: Platform.OS === "android" ? Spacing.sm : 0,
    overflow: "visible",
    ...(Platform.OS === "android" && {
      minHeight: 60,
      paddingVertical: Spacing.sm + 2,
    }),
  },
});
