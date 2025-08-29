import { WeatherCard } from "@/components/WeatherCard";
import { fetchWeatherByCity, WeatherData } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<WeatherData | null>(null);
  const [searching, setSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      Alert.alert("Error", "Please enter a city name");
      return;
    }

    try {
      setSearching(true);
      setSearchResult(null);

      const result = await fetchWeatherByCity(searchQuery.trim());

      if (result) {
        setSearchResult(result);
        // Update search query to show normalized city name
        setSearchQuery(result.city);
        // Add to recent searches
        setRecentSearches((prev) => {
          const filtered = prev.filter((city) => city !== result.city);
          return [result.city, ...filtered].slice(0, 5);
        });
      } else {
        Alert.alert(
          "Not Found",
          `Weather data not found for "${searchQuery.trim()}". Please check the city name.`
        );
      }
    } catch (error) {
      console.error("Search error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      Alert.alert("Search Failed", errorMessage);
    } finally {
      setSearching(false);
    }
  }, [searchQuery]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResult(null);
  }, []);

  const handleRecentSearch = useCallback(
    (city: string) => {
      setSearchQuery(city);
      // Auto-search when tapping recent search
      setTimeout(() => handleSearch(), 100);
    },
    [handleSearch]
  );

  const handleCityPress = useCallback((city: string) => {
    Alert.alert("City Selected", `You selected ${city}`);
  }, []);

  const handleInputChange = useCallback((text: string) => {
    // Auto-capitalize first letter as user types
    if (text.length === 1) {
      setSearchQuery(text.toUpperCase());
    } else {
      setSearchQuery(text);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <Ionicons
              name="search"
              size={Math.max(32, screenWidth * 0.08)}
              color="#4A90E2"
            />
            <Text style={styles.title}>Weather Search</Text>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Enter city name..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={handleInputChange}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
                autoCapitalize="words"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={[
                  styles.searchButton,
                  searching && styles.searchButtonDisabled,
                ]}
                onPress={handleSearch}
                disabled={searching}
              >
                {searching ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Ionicons name="search" size={20} color="white" />
                )}
              </TouchableOpacity>
            </View>

            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearSearch}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>

          {recentSearches.length > 0 && !searchResult && (
            <View style={styles.recentContainer}>
              <Text style={styles.recentTitle}>Recent Searches</Text>
              <View style={styles.recentList}>
                {recentSearches.map((city, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.recentItem}
                    onPress={() => handleRecentSearch(city)}
                  >
                    <Ionicons name="time" size={16} color="#666" />
                    <Text style={styles.recentText}>{city}</Text>
                    <Ionicons name="chevron-forward" size={16} color="#999" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {searchResult && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>
                Weather in {searchResult.city}
              </Text>

              <WeatherCard
                weather={searchResult}
                onPress={() => handleCityPress(searchResult.city)}
                isCompact={false}
              />
            </View>
          )}

          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Available Cities</Text>
            <Text style={styles.infoText}>
              New York, London, Dubai, Tokyo, Paris, Sydney, Mumbai, Cairo,
              Toronto, Berlin
            </Text>
            <Text style={styles.infoSubtext}>
              Try searching for any of these cities to see their current weather
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Math.max(20, screenHeight * 0.025),
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: Math.max(24, screenWidth * 0.06),
    fontWeight: "600",
    color: "#333",
    marginLeft: 12,
  },
  searchContainer: {
    padding: Math.max(20, screenWidth * 0.05),
    backgroundColor: "white",
    margin: Math.max(16, screenWidth * 0.04),
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
    height: Math.max(50, screenHeight * 0.06),
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: Math.max(16, screenWidth * 0.04),
    marginRight: 12,
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#4A90E2",
    height: Math.max(50, screenHeight * 0.06),
    width: Math.max(50, screenHeight * 0.06),
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  searchButtonDisabled: {
    backgroundColor: "#A0A0A0",
  },
  clearButton: {
    alignSelf: "flex-end",
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  clearButtonText: {
    color: "#666",
    fontSize: Math.max(14, screenWidth * 0.035),
  },
  recentContainer: {
    backgroundColor: "white",
    margin: Math.max(16, screenWidth * 0.04),
    borderRadius: 16,
    padding: Math.max(20, screenWidth * 0.05),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2.84,
    elevation: 3,
  },
  recentTitle: {
    fontSize: Math.max(18, screenWidth * 0.045),
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  recentList: {
    gap: 8,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    gap: 12,
  },
  recentText: {
    flex: 1,
    fontSize: Math.max(16, screenWidth * 0.04),
    color: "#333",
  },
  resultContainer: {
    backgroundColor: "white",
    margin: Math.max(16, screenWidth * 0.04),
    borderRadius: 16,
    padding: Math.max(20, screenWidth * 0.05),
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
    fontSize: Math.max(20, screenWidth * 0.05),
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  infoContainer: {
    backgroundColor: "white",
    margin: Math.max(16, screenWidth * 0.04),
    borderRadius: 16,
    padding: Math.max(20, screenWidth * 0.05),
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
    fontSize: Math.max(18, screenWidth * 0.045),
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  infoText: {
    fontSize: Math.max(14, screenWidth * 0.035),
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
  },
  infoSubtext: {
    fontSize: Math.max(12, screenWidth * 0.03),
    color: "#999",
    fontStyle: "italic",
  },
});
