import React from "react";
import { Dimensions, StyleSheet, Switch, Text, View } from "react-native";
import { useTemperature } from "../contexts/TemperatureContext";

const { width: screenWidth } = Dimensions.get("window");

interface TemperatureToggleProps {
  style?: any;
}

export const TemperatureToggle: React.FC<TemperatureToggleProps> = ({
  style,
}) => {
  const { unit, toggleUnit } = useTemperature();
  const isFahrenheit = unit === "fahrenheit";

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.unitLabel, !isFahrenheit && styles.activeLabel]}>
        °C
      </Text>
      <Switch
        value={isFahrenheit}
        onValueChange={toggleUnit}
        trackColor={{ false: "#4A90E2", true: "#FF6B35" }}
        thumbColor={isFahrenheit ? "#fff" : "#fff"}
        ios_backgroundColor="#E0E0E0"
        style={styles.switch}
      />
      <Text style={[styles.unitLabel, isFahrenheit && styles.activeLabel]}>
        °F
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: "#000",
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
    color: "#666",
  },
  activeLabel: {
    color: "#333",
  },
});
