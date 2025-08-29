import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  BorderRadius,
  Shadows,
  Spacing,
  Typography,
} from "../constants/DesignSystem";
import { ThemeMode, useTheme } from "../contexts/ThemeContext";

interface ThemeToggleProps {
  style?: any;
  compact?: boolean;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  style,
  compact = false,
  showLabel = true,
}) => {
  const { mode, activeTheme, setThemeMode, colors, isAutoMode } = useTheme();

  // Animation for the toggle switch
  const switchAnimation = React.useRef(
    new Animated.Value(mode === "light" ? 0 : mode === "dark" ? 1 : 0.5)
  ).current;

  React.useEffect(() => {
    const targetValue = mode === "light" ? 0 : mode === "dark" ? 1 : 0.5;

    Animated.spring(switchAnimation, {
      toValue: targetValue,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  }, [mode, switchAnimation]);

  const handleThemeModeChange = (newMode: ThemeMode) => {
    setThemeMode(newMode);

    // Show feedback to user
    const modeNames = {
      light: "Light Mode",
      dark: "Dark Mode",
      auto: "Auto Mode (Time-based)",
    };
  };

  const getThemeIcon = (themeMode: ThemeMode) => {
    switch (themeMode) {
      case "light":
        return "weather-sunny";
      case "dark":
        return "weather-night";
      case "auto":
        return "brightness-auto";
      default:
        return "weather-sunny";
    }
  };

  const getThemeLabel = (themeMode: ThemeMode) => {
    switch (themeMode) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "auto":
        return "Auto";
      default:
        return "Light";
    }
  };

  if (compact) {
    return (
      <View style={[styles.compactContainer, style]}>
        <TouchableOpacity
          style={[
            styles.compactButton,
            {
              backgroundColor: colors.background.card,
              borderColor: colors.border.primary,
            },
          ]}
          onPress={() => {
            const nextMode: ThemeMode =
              mode === "light" ? "dark" : mode === "dark" ? "auto" : "light";
            handleThemeModeChange(nextMode);
          }}
          activeOpacity={0.7}
          accessible={true}
          accessibilityLabel={`Current theme: ${getThemeLabel(
            mode
          )}. Tap to change.`}
          accessibilityRole="button"
        >
          <MaterialCommunityIcons
            name={getThemeIcon(mode) as any}
            size={24}
            color={colors.icon.primary}
          />
          {isAutoMode && (
            <View style={styles.autoIndicator}>
              <Text style={[styles.autoText, { color: colors.text.tertiary }]}>
                {activeTheme === "light" ? "L" : "D"}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {showLabel && (
        <Text style={[styles.label, { color: colors.text.primary }]}>
          Theme Preference
        </Text>
      )}

      <View style={styles.toggleContainer}>
        {/* Theme Mode Options */}
        <View
          style={[
            styles.optionsContainer,
            {
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
            },
          ]}
        >
          {(["light", "dark", "auto"] as ThemeMode[]).map((themeMode) => (
            <TouchableOpacity
              key={themeMode}
              style={[
                styles.optionButton,
                mode === themeMode && {
                  backgroundColor: colors.background.card,
                  ...Shadows.sm,
                },
              ]}
              onPress={() => handleThemeModeChange(themeMode)}
              activeOpacity={0.7}
              accessible={true}
              accessibilityLabel={`${getThemeLabel(themeMode)} theme mode`}
              accessibilityRole="button"
              accessibilityState={{ selected: mode === themeMode }}
            >
              <MaterialCommunityIcons
                name={getThemeIcon(themeMode) as any}
                size={20}
                color={
                  mode === themeMode
                    ? colors.icon.accent
                    : colors.icon.secondary
                }
              />
              <Text
                style={[
                  styles.optionText,
                  {
                    color:
                      mode === themeMode
                        ? colors.text.primary
                        : colors.text.secondary,
                    fontWeight: mode === themeMode ? "600" : "400",
                  },
                ]}
              >
                {getThemeLabel(themeMode)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Current Status */}
        <View style={styles.statusContainer}>
          <View style={styles.statusRow}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={colors.icon.secondary}
            />
            <Text style={[styles.statusText, { color: colors.text.secondary }]}>
              {isAutoMode
                ? `Auto mode: Currently ${activeTheme} (${
                    activeTheme === "light" ? "6 AM - 6 PM" : "6 PM - 6 AM"
                  })`
                : `Manual mode: Always ${activeTheme}`}
            </Text>
          </View>

          {isAutoMode && (
            <View style={styles.statusRow}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={16}
                color={colors.icon.secondary}
              />
              <Text
                style={[styles.statusText, { color: colors.text.tertiary }]}
              >
                Theme switches automatically based on time
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.md,
  },
  label: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    marginBottom: Spacing.md,
    letterSpacing: Typography.letterSpacing.tight,
  },
  toggleContainer: {
    gap: Spacing.md,
  },
  optionsContainer: {
    flexDirection: "row",
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.xs,
    gap: Spacing.xs,
  },
  optionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  optionText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  statusContainer: {
    gap: Spacing.sm,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  statusText: {
    fontSize: Typography.fontSize.sm,
    flex: 1,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.sm,
  },
  compactContainer: {
    alignItems: "center",
  },
  compactButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    ...Shadows.sm,
    position: "relative",
  },
  autoIndicator: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "rgba(0, 150, 255, 0.9)",
    borderRadius: BorderRadius.full,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  autoText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "white",
  },
});
