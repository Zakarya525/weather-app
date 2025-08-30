import { useTheme } from "@/contexts/ThemeContext";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";

export default function BlurTabBarBackground() {
  const { isDarkActive } = useTheme();

  return (
    <BlurView
      // Use explicit tint based on theme instead of systemChromeMaterial
      tint={isDarkActive ? "dark" : "light"}
      intensity={100}
      style={StyleSheet.absoluteFill}
    />
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}
