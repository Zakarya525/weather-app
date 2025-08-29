import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface ErrorMessageProps {
  title: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  onRetry,
  retryText = "Try Again",
}) => {
  return (
    <View style={styles.container}>
      <Ionicons
        name="alert-circle"
        size={Math.max(64, screenWidth * 0.16)}
        color="#FF3B30"
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Ionicons name="refresh" size={20} color="white" />
          <Text style={styles.retryText}>{retryText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Math.max(20, screenWidth * 0.05),
    paddingVertical: Math.max(40, screenHeight * 0.05),
  },
  title: {
    fontSize: Math.max(20, screenWidth * 0.05),
    fontWeight: "600",
    color: "#333",
    marginTop: Math.max(16, screenHeight * 0.02),
    marginBottom: Math.max(8, screenHeight * 0.01),
    textAlign: "center",
  },
  message: {
    fontSize: Math.max(16, screenWidth * 0.04),
    color: "#666",
    textAlign: "center",
    lineHeight: Math.max(22, screenWidth * 0.055),
    marginBottom: Math.max(24, screenHeight * 0.03),
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4A90E2",
    paddingHorizontal: Math.max(20, screenWidth * 0.05),
    paddingVertical: Math.max(12, screenHeight * 0.015),
    borderRadius: 8,
    gap: 8,
  },
  retryText: {
    color: "white",
    fontSize: Math.max(16, screenWidth * 0.04),
    fontWeight: "600",
  },
});
