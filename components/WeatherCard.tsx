import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFavorites } from "../contexts/FavoritesContext";
import { useTemperature } from "../contexts/TemperatureContext";
import { WeatherData } from "../utils/api";

const { width: screenWidth } = Dimensions.get("window");

interface WeatherCardProps {
  weather: WeatherData;
  onPress?: () => void;
  isCompact?: boolean;
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

const getWeatherColor = (condition: string) => {
  switch (condition.toLowerCase()) {
    case "sunny":
      return "#FF9500";
    case "cloudy":
      return "#8E8E93";
    case "rainy":
      return "#007AFF";
    case "partly cloudy":
      return "#5AC8FA";
    case "humid":
      return "#34C759";
    default:
      return "#5AC8FA";
  }
};

export const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  onPress,
  isCompact = false,
}) => {
  const weatherColor = getWeatherColor(weather.condition);
  const { getTemperatureDisplay } = useTemperature();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();

  const handleFavoritePress = async (e: any) => {
    e.stopPropagation(); // Prevent triggering the card's onPress

    try {
      if (isFavorite(weather.id)) {
        await removeFromFavorites(weather.id);
        Alert.alert(
          "Removed",
          `${weather.city} has been removed from favorites`
        );
      } else {
        await addToFavorites(weather);
        Alert.alert("Added", `${weather.city} has been added to favorites`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update favorites");
    }
  };

  if (isCompact) {
    return (
      <TouchableOpacity
        style={styles.compactCard}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.compactHeader}>
          <Text style={styles.compactCityName}>{weather.city}</Text>
          <View style={styles.compactHeaderRight}>
            <Ionicons
              name={getWeatherIcon(weather.condition) as any}
              size={24}
              color={weatherColor}
            />
            <TouchableOpacity
              style={styles.compactFavoriteButton}
              onPress={handleFavoritePress}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isFavorite(weather.id) ? "star" : "star-outline"}
                size={20}
                color={isFavorite(weather.id) ? "#FFD700" : "#666"}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.compactTemperatureContainer}>
          <Text style={styles.compactTemperature}>
            {getTemperatureDisplay(weather.temperature)}
          </Text>
          <Text style={styles.compactCondition}>{weather.condition}</Text>
        </View>

        <View style={styles.compactDetails}>
          <View style={styles.compactDetailItem}>
            <Ionicons name="water" size={14} color="#666" />
            <Text style={styles.compactDetailText}>{weather.humidity}%</Text>
          </View>
          <View style={styles.compactDetailItem}>
            <Ionicons name="airplane" size={14} color="#666" />
            <Text style={styles.compactDetailText}>
              {weather.windSpeed} km/h
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.cityName}>{weather.city}</Text>
        <View style={styles.headerRight}>
          <Ionicons
            name={getWeatherIcon(weather.condition) as any}
            size={32}
            color={weatherColor}
          />
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoritePress}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFavorite(weather.id) ? "star" : "star-outline"}
              size={24}
              color={isFavorite(weather.id) ? "#FFD700" : "#666"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.temperatureContainer}>
        <Text style={styles.temperature}>
          {getTemperatureDisplay(weather.temperature)}
        </Text>
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
    marginHorizontal: Math.max(16, screenWidth * 0.04),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: 160,
  },
  compactCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: Math.max(12, screenWidth * 0.03),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2.84,
    elevation: 3,
    minHeight: 120,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  compactHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  compactHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  favoriteButton: {
    padding: 4,
  },
  compactFavoriteButton: {
    padding: 2,
  },
  cityName: {
    fontSize: Math.max(20, screenWidth * 0.05),
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  compactCityName: {
    fontSize: Math.max(16, screenWidth * 0.04),
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  temperatureContainer: {
    marginBottom: 16,
  },
  compactTemperatureContainer: {
    marginBottom: 12,
  },
  temperature: {
    fontSize: Math.max(36, screenWidth * 0.09),
    fontWeight: "700",
    color: "#4A90E2",
    marginBottom: 4,
  },
  compactTemperature: {
    fontSize: Math.max(28, screenWidth * 0.07),
    fontWeight: "700",
    color: "#4A90E2",
    marginBottom: 4,
  },
  condition: {
    fontSize: Math.max(16, screenWidth * 0.04),
    color: "#666",
  },
  compactCondition: {
    fontSize: Math.max(14, screenWidth * 0.035),
    color: "#666",
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  compactDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  compactDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: Math.max(14, screenWidth * 0.035),
    color: "#666",
  },
  compactDetailText: {
    fontSize: Math.max(12, screenWidth * 0.03),
    color: "#666",
  },
});
