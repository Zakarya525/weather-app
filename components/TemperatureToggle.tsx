import React from "react";
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useTemperature } from "../contexts/TemperatureContext";
import { useTheme } from "../contexts/ThemeContext";

const { width: screenWidth } = Dimensions.get("window");

interface TemperatureToggleProps {
  style?: ViewStyle;
}

export const TemperatureToggle: React.FC<TemperatureToggleProps> = ({
  style,
}) => {
  const { unit, toggleUnit } = useTemperature();
  const { colors } = useTheme();
  const isFahrenheit = unit === "fahrenheit";

  // Animation values for smooth transitions
  const thumbPosition = React.useRef(
    new Animated.Value(isFahrenheit ? 1 : 0)
  ).current;
  const backgroundColorAnim = React.useRef(
    new Animated.Value(isFahrenheit ? 1 : 0)
  ).current;

  // Safety check for Android - ensure contexts are properly loaded
  if (!unit || !colors) {
    if (__DEV__ && Platform.OS === "android") {
      console.log("TemperatureToggle: Contexts not loaded yet", {
        unit,
        colors: !!colors,
      });
    }
    return null;
  }

  // Update animations when unit changes
  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(thumbPosition, {
        toValue: isFahrenheit ? 1 : 0,
        useNativeDriver: false,
        tension: 150,
        friction: 8,
      }),
      Animated.timing(backgroundColorAnim, {
        toValue: isFahrenheit ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isFahrenheit, thumbPosition, backgroundColorAnim]);

  // Enhanced toggle function with Android-specific handling
  const handleToggle = React.useCallback(() => {
    if (__DEV__ && Platform.OS === "android") {
      console.log("TemperatureToggle: Toggle pressed", {
        currentUnit: unit,
        willChangeTo: unit === "celsius" ? "fahrenheit" : "celsius",
      });
    }

    try {
      toggleUnit();
    } catch (error) {
      if (__DEV__) {
        console.error("TemperatureToggle: Error toggling unit", error);
      }
    }
  }, [unit, toggleUnit]);

  // Custom animated switch for Android with BlurHeader compatibility
  if (Platform.OS === "android") {
    const animatedBackgroundColor = backgroundColorAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.icon.accent, "#FF6B35"],
    });

    const thumbTranslateX = thumbPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [2, 22], // Move from left (2px) to right (22px)
    });

    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background.card,
            borderColor: colors.border.primary,
          },
          style,
          {
            zIndex: 10001,
            elevation: 12,
            position: "relative",
            overflow: "visible",
          },
        ]}
      >
        <Text
          style={[
            styles.unitLabel,
            { color: colors.text.secondary },
            !isFahrenheit && {
              color: colors.text.primary,
              fontWeight: "700",
            },
          ]}
        >
          °C
        </Text>

        <TouchableOpacity
          onPress={handleToggle}
          activeOpacity={0.9}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          style={{
            marginHorizontal: 12,
            zIndex: 10002,
            elevation: 13,
          }}
        >
          <Animated.View
            style={[
              styles.switchTrack,
              {
                backgroundColor: animatedBackgroundColor,
              },
            ]}
          >
            <Animated.View
              style={[
                styles.switchThumb,
                {
                  transform: [{ translateX: thumbTranslateX }],
                  shadowColor: colors.text.primary,
                },
              ]}
            />
          </Animated.View>
        </TouchableOpacity>

        <Text
          style={[
            styles.unitLabel,
            { color: colors.text.secondary },
            isFahrenheit && {
              color: colors.text.primary,
              fontWeight: "700",
            },
          ]}
        >
          °F
        </Text>
      </View>
    );
  }

  // iOS version with enhanced design consistency
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background.card,
          borderColor: colors.border.primary,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.unitLabel,
          { color: colors.text.secondary },
          !isFahrenheit && {
            color: colors.text.primary,
            fontWeight: "700",
          },
        ]}
      >
        °C
      </Text>
      <Switch
        value={isFahrenheit}
        onValueChange={handleToggle}
        trackColor={{
          false: colors.icon.accent,
          true: "#FF6B35",
        }}
        thumbColor="#ffffff"
        ios_backgroundColor={colors.border.primary}
        style={[
          styles.switch,
          {
            transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
          },
        ]}
      />
      <Text
        style={[
          styles.unitLabel,
          { color: colors.text.secondary },
          isFahrenheit && {
            color: colors.text.primary,
            fontWeight: "700",
          },
        ]}
      >
        °F
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: Platform.select({
      ios: 8,
      android: 10,
    }),
    borderWidth: 1.5,
    overflow: "visible",
    ...Platform.select({
      ios: {
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
        minHeight: 48,
        position: "relative",
      },
    }),
  },
  switch: {
    marginHorizontal: Platform.select({
      ios: 10,
      android: 12,
    }),
  },
  // New styles for custom Android switch
  switchTrack: {
    width: 50,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    position: "relative",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    position: "absolute",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
    // Add a subtle border for better definition
    borderWidth: 0.5,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  unitLabel: {
    fontSize: Math.max(15, screenWidth * 0.038),
    fontWeight: "600",
    letterSpacing: 0.5,
    ...Platform.select({
      android: {
        textAlignVertical: "center",
        includeFontPadding: false,
        fontFamily: "System",
      },
      ios: {
        fontFamily: "System",
      },
    }),
  },
});
