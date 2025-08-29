import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "large";
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
  size = "large",
  color = "#4A90E2",
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Math.max(20, screenHeight * 0.025),
  },
  message: {
    fontSize: Math.max(16, screenWidth * 0.04),
    color: "#666",
    marginTop: Math.max(16, screenHeight * 0.02),
    textAlign: "center",
  },
});
