import React from "react";
import { Dimensions, StyleSheet, Switch, Text, View } from "react-native";
import { useTemperature } from "../contexts/TemperatureContext";
import { useTheme } from "../contexts/ThemeContext";

const { width: screenWidth } = Dimensions.get("window");

interface TemperatureToggleProps {
  style?: any;
}

export const TemperatureToggle: React.FC<TemperatureToggleProps> = ({
  style,
}) => {
  const { unit, toggleUnit } = useTemperature();
  const { colors } = useTheme();
  const isFahrenheit = unit === "fahrenheit";

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
          !isFahrenheit && { color: colors.text.primary },
        ]}
      >
        °C
      </Text>
      <Switch
        value={isFahrenheit}
        onValueChange={toggleUnit}
        trackColor={{ false: colors.icon.accent, true: "#FF6B35" }}
        thumbColor="#fff"
        ios_backgroundColor={colors.border.primary}
        style={styles.switch}
      />
      <Text
        style={[
          styles.unitLabel,
          { color: colors.text.secondary },
          isFahrenheit && { color: colors.text.primary },
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
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  switch: {
    marginHorizontal: 8,
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
  unitLabel: {
    fontSize: Math.max(14, screenWidth * 0.035),
    fontWeight: "600",
  },
});
