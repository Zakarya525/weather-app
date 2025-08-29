import React from "react";
import { Animated, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "../hooks/useThemeColor";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface OfflineBannerProps {
  visible: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ visible }) => {
  const insets = useSafeAreaInsets();
  const textColor = useThemeColor(
    { light: "#856404", dark: "#FFE58F" },
    "text"
  );
  const backgroundColor = useThemeColor(
    { light: "#FFF3CD", dark: "#2D1B0D" },
    "background"
  );
  const borderColor = useThemeColor(
    { light: "#FFE58F", dark: "#FFB74D" },
    "icon"
  );

  const [animation] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.spring(animation, {
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          transform: [
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              }),
            },
          ],
        },
      ]}
    >
      <ThemedView
        style={[
          styles.banner,
          {
            backgroundColor,
            borderColor,
          },
        ]}
      >
        <ThemedText style={[styles.text, { color: textColor }]}>
          You&apos;re Offline
        </ThemedText>
      </ThemedView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 16,
  },
  banner: {
    padding: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
});
