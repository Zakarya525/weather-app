import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Animated, StyleSheet, ViewStyle } from "react-native";
import { ANIMATION_DURATION, getWeatherTheme } from "../utils/weatherTheme";

interface WeatherGradientProps {
  condition: string;
  style?: ViewStyle;
  children?: React.ReactNode;
  intensity?: number; // 0-1, controls gradient opacity
  animated?: boolean;
}

export const WeatherGradient: React.FC<WeatherGradientProps> = ({
  condition,
  style,
  children,
  intensity = 1,
  animated = true,
}) => {
  const theme = getWeatherTheme(condition);
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: false,
      }).start();
    }
  }, [condition, animated, animatedValue]);

  const gradientColors = theme.gradientColors.map((color) => {
    if (intensity < 1) {
      // Adjust opacity based on intensity
      const hex = color.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${intensity})`;
    }
    return color;
  });

  if (animated) {
    return (
      <Animated.View
        style={[
          style,
          {
            opacity: animatedValue,
          },
        ]}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[StyleSheet.absoluteFillObject, style]}
        >
          {children}
        </LinearGradient>
      </Animated.View>
    );
  }

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[StyleSheet.absoluteFillObject, style]}
    >
      {children}
    </LinearGradient>
  );
};

// Alternative gradient component for subtle card backgrounds
export const WeatherCardGradient: React.FC<WeatherGradientProps> = ({
  condition,
  style,
  children,
  intensity = 0.1,
  animated = true,
}) => {
  return (
    <WeatherGradient
      condition={condition}
      style={style}
      intensity={intensity}
      animated={animated}
    >
      {children}
    </WeatherGradient>
  );
};
