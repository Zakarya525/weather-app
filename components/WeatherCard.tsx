import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { WeatherData } from "../utils/api";

interface WeatherCardProps {
  weather: WeatherData;
  onPress?: () => void;
}

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case "sunny":
      return "sunny";
    case "cloudy":
      return "cloudy";
    case "rainy":
      return "rainy";
    case "partly cloudy":
      return "partly-sunny";
    case "humid":
      return "water";
    default:
      return "partly-sunny";
  }
};

export const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.cityName}>{weather.city}</Text>
        <Ionicons
          name={getWeatherIcon(weather.condition) as any}
          size={32}
          color="#4A90E2"
        />
      </View>

      <View style={styles.temperatureContainer}>
        <Text style={styles.temperature}>{weather.temperature}°</Text>
        <Text style={styles.condition}>{weather.condition}</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="water" size={16} color="#666" />
          <Text style={styles.detailText}>{weather.humidity}%</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="airplane" size={16} color="#666" />
          <Text style={styles.detailText}>{weather.windSpeed} km/h</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cityName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  temperatureContainer: {
    marginBottom: 16,
  },
  temperature: {
    fontSize: 36,
    fontWeight: "700",
    color: "#4A90E2",
    marginBottom: 4,
  },
  condition: {
    fontSize: 16,
    color: "#666",
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
  },
});
