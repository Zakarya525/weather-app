import { fetchWeatherByCity, WeatherData } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<WeatherData | null>(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert("Error", "Please enter a city name");
      return;
    }

    try {
      setSearching(true);
      const result = await fetchWeatherByCity(searchQuery.trim());
      setSearchResult(result);

      if (!result) {
        Alert.alert("Not Found", `Weather data not found for ${searchQuery}`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to search for weather data");
      console.error("Search error:", error);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResult(null);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="search" size={32} color="#4A90E2" />
        <Text style={styles.title}>Weather Search</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter city name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={searching}
          >
            <Ionicons
              name={searching ? "hourglass" : "search"}
              size={20}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {searchQuery.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {searchResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Weather in {searchResult.city}</Text>

          <View style={styles.weatherInfo}>
            <View style={styles.temperatureSection}>
              <Text style={styles.temperature}>
                {searchResult.temperature}°C
              </Text>
              <Text style={styles.condition}>{searchResult.condition}</Text>
            </View>

            <View style={styles.detailsGrid}>
              <View style={styles.detailCard}>
                <Ionicons name="water" size={24} color="#4A90E2" />
                <Text style={styles.detailLabel}>Humidity</Text>
                <Text style={styles.detailValue}>{searchResult.humidity}%</Text>
              </View>

              <View style={styles.detailCard}>
                <Ionicons name="airplane" size={24} color="#4A90E2" />
                <Text style={styles.detailLabel}>Wind Speed</Text>
                <Text style={styles.detailValue}>
                  {searchResult.windSpeed} km/h
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Available Cities</Text>
        <Text style={styles.infoText}>
          New York, London, Dubai, Tokyo, Paris, Sydney, Mumbai, Cairo, Toronto,
          Berlin
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginLeft: 12,
  },
  searchContainer: {
    padding: 20,
    backgroundColor: "white",
    margin: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginRight: 12,
  },
  searchButton: {
    backgroundColor: "#4A90E2",
    height: 50,
    width: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButton: {
    alignSelf: "flex-end",
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  clearButtonText: {
    color: "#666",
    fontSize: 14,
  },
  resultContainer: {
    backgroundColor: "white",
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  weatherInfo: {
    alignItems: "center",
  },
  temperatureSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  temperature: {
    fontSize: 48,
    fontWeight: "700",
    color: "#4A90E2",
    marginBottom: 8,
  },
  condition: {
    fontSize: 18,
    color: "#666",
  },
  detailsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  detailCard: {
    alignItems: "center",
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  infoContainer: {
    backgroundColor: "white",
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
