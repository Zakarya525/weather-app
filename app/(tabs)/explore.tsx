import { RecentSearches } from "@/components/RecentSearches";
import { TemperatureToggle } from "@/components/TemperatureToggle";
import { WeatherCard } from "@/components/WeatherCard";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { fetchWeatherByCity, WeatherData } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { memo, useCallback, useMemo, useState } from "react";
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

// Memoized search button component for better performance
const SearchButton = memo<{
  searching: boolean;
  onPress: () => void;
}>(({ searching, onPress }) => (
  <TouchableOpacity
    style={[styles.searchButton, searching && styles.searchButtonDisabled]}
    onPress={onPress}
    disabled={searching}
  >
    {searching ? (
      <ActivityIndicator size="small" color="white" />
    ) : (
      <Ionicons name="search" size={20} color="white" />
    )}
  </TouchableOpacity>
));

SearchButton.displayName = "SearchButton";

// Memoized clear button component
const ClearButton = memo<{
  onPress: () => void;
}>(({ onPress }) => (
  <TouchableOpacity style={styles.clearButton} onPress={onPress}>
    <Text style={styles.clearButtonText}>Clear</Text>
  </TouchableOpacity>
));

ClearButton.displayName = "ClearButton";

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<WeatherData | null>(null);
  const [searching, setSearching] = useState(false);

  // Recent searches hook
  const {
    recentSearches,
    loading: recentSearchesLoading,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  } = useRecentSearches();

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
        await addRecentSearch(result.city);
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

  // Handle recent search tap - reload weather data for that city
  const handleRecentSearchPress = useCallback(
    async (city: string) => {
      try {
        setSearching(true);
        setSearchResult(null);
        setSearchQuery(city);

        const result = await fetchWeatherByCity(city);

        if (result) {
          setSearchResult(result);
          // Update recent search timestamp
          await addRecentSearch(result.city);
        } else {
          Alert.alert(
            "Not Found",
            `Weather data not found for "${city}". The city might no longer be available.`
          );
        }
      } catch (error) {
        console.error("Recent search error:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        Alert.alert("Search Failed", errorMessage);
      } finally {
        setSearching(false);
      }
    },
    [addRecentSearch]
  );

  // Memoized values for performance optimization
  const hasSearchQuery = useMemo(() => searchQuery.length > 0, [searchQuery]);
  const shouldShowRecentSearches = useMemo(
    () => !searchResult && !recentSearchesLoading,
    [searchResult, recentSearchesLoading]
  );

  // Memoized icon size calculations
  const iconSize = useMemo(
    () => Math.max(32, screenWidth * 0.08),
    [screenWidth]
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.mainContainer}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerLeft}>
                <Ionicons name="search" size={iconSize} color="#4A90E2" />
              </View>
              <TemperatureToggle style={styles.temperatureToggle} />
            </View>
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
              <SearchButton searching={searching} onPress={handleSearch} />
            </View>

            {hasSearchQuery && <ClearButton onPress={clearSearch} />}
          </View>

          <View style={styles.contentContainer}>
            {/* Recent Searches - shown when no search result */}
            {shouldShowRecentSearches && (
              <RecentSearches
                recentSearches={recentSearches}
                onSearchPress={handleRecentSearchPress}
                onClearAll={clearRecentSearches}
                onRemoveSearch={removeRecentSearch}
              />
            )}

            {searchResult && (
              <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
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

                <View style={styles.infoContainer}>
                  <Text style={styles.infoTitle}>Available Cities</Text>
                  <Text style={styles.infoText}>
                    New York, London, Dubai, Tokyo, Paris, Sydney, Mumbai,
                    Cairo, Toronto, Berlin
                  </Text>
                  <Text style={styles.infoSubtext}>
                    Try searching for any of these cities to see their current
                    weather
                  </Text>
                </View>
              </ScrollView>
            )}

            {!searchResult && !shouldShowRecentSearches && (
              <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                <View style={styles.infoContainer}>
                  <Text style={styles.infoTitle}>Available Cities</Text>
                  <Text style={styles.infoText}>
                    New York, London, Dubai, Tokyo, Paris, Sydney, Mumbai,
                    Cairo, Toronto, Berlin
                  </Text>
                  <Text style={styles.infoSubtext}>
                    Try searching for any of these cities to see their current
                    weather
                  </Text>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  mainContainer: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Math.max(20, screenHeight * 0.025),
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: Math.max(20, screenWidth * 0.05),
  },
  headerLeft: {
    flex: 1,
  },
  temperatureToggle: {
    marginRight: 0,
  },
  title: {
    fontSize: Math.max(24, screenWidth * 0.06),
    fontWeight: "600",
    color: "#333",
    marginTop: 12,
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
