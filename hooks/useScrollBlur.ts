import { useRef } from "react";
import { Animated } from "react-native";

interface UseScrollBlurOptions {
  threshold?: number;
}

export function useScrollBlur(options: UseScrollBlurOptions = {}) {
  const { threshold = 20 } = options;

  const scrollY = useRef(new Animated.Value(0)).current;

  const scrollHandler = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, threshold / 2, threshold],
    outputRange: [1, 0.95, 0.85],
    extrapolate: "clamp",
  });

  return {
    scrollY,
    scrollHandler,
    headerOpacity,
  };
}
