import { RecentSearches } from "@/components/RecentSearches";
import { TemperatureToggle } from "@/components/TemperatureToggle";
import { WeatherCard } from "@/components/WeatherCard";
import { WeatherGradient } from "@/components/WeatherGradient";
import {
  Animations,
  BorderRadius,
  Colors,
  GlassMorphism,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/DesignSystem";
import { useTheme } from "@/contexts/ThemeContext";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { fetchWeatherByCity, WeatherData } from "@/utils/api";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo, useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
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
  const { colors } = useTheme();

  // Animation values
  const fadeValue = useState(new Animated.Value(0))[0];
  const slideValue = useState(new Animated.Value(50))[0];

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: Animations.timing.normal,
        useNativeDriver: true,
      }),
      Animated.timing(slideValue, {
        toValue: 0,
        duration: Animations.timing.normal,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <WeatherGradient
        condition={searchResult?.condition || "partly cloudy"}
        intensity={0.2}
        style={styles.backgroundGradient}
      />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Animated.View
            style={[
              styles.mainContainer,
              {
                opacity: fadeValue,
                transform: [{ translateY: slideValue }],
              },
            ]}
          >
            <View
              style={[
                styles.header,
                {
                  backgroundColor: colors.background.card,
                  borderColor: colors.border.primary,
                },
              ]}
            >
              <View style={styles.headerTop}>
                <View style={styles.headerLeft}>
                  <MaterialCommunityIcons
                    name="weather-partly-cloudy"
                    size={iconSize}
                    color={Colors.primary[500]}
                  />
                </View>
                <TemperatureToggle style={styles.temperatureToggle} />
              </View>
              <Text style={[styles.title, { color: colors.text.primary }]}>
                Weather Search
              </Text>
            </View>

            <View
              style={[
                styles.searchContainer,
                {
                  backgroundColor: colors.background.card,
                  borderColor: colors.border.primary,
                },
              ]}
            >
              <View style={styles.searchInputContainer}>
                <TextInput
                  style={[
                    styles.searchInput,
                    {
                      backgroundColor: colors.background.secondary,
                      borderColor: colors.border.primary,
                      color: colors.text.primary,
                    },
                  ]}
                  placeholder="Enter city name..."
                  placeholderTextColor={colors.text.tertiary}
                  value={searchQuery}
                  onChangeText={handleInputChange}
                  onSubmitEditing={handleSearch}
                  returnKeyType="search"
                  autoCapitalize="words"
                  autoCorrect={false}
                />
                <SearchButton searching={searching} onPress={handleSearch} />
              </View>

              {hasSearchQuery && (
                <TouchableOpacity
                  style={[
                    styles.clearButton,
                    {
                      backgroundColor: colors.background.secondary,
                      borderColor: colors.border.primary,
                    },
                  ]}
                  onPress={clearSearch}
                >
                  <Text
                    style={[
                      styles.clearButtonText,
                      { color: colors.text.secondary },
                    ]}
                  >
                    Clear
                  </Text>
                </TouchableOpacity>
              )}
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
                  <View
                    style={[
                      styles.resultContainer,
                      {
                        backgroundColor: colors.background.card,
                        borderColor: colors.border.primary,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.resultTitle,
                        { color: colors.text.primary },
                      ]}
                    >
                      Weather in {searchResult.city}
                    </Text>

                    <WeatherCard
                      weather={searchResult}
                      onPress={() => handleCityPress(searchResult.city)}
                      isCompact={false}
                    />
                  </View>

                  <View
                    style={[
                      styles.infoContainer,
                      {
                        backgroundColor: colors.background.card,
                        borderColor: colors.border.primary,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.infoTitle, { color: colors.text.primary }]}
                    >
                      Available Cities
                    </Text>
                    <Text
                      style={[
                        styles.infoText,
                        { color: colors.text.secondary },
                      ]}
                    >
                      New York, London, Dubai, Tokyo, Paris, Sydney, Mumbai,
                      Cairo, Toronto, Berlin
                    </Text>
                    <Text
                      style={[
                        styles.infoSubtext,
                        { color: colors.text.tertiary },
                      ]}
                    >
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
                  <View
                    style={[
                      styles.infoContainer,
                      {
                        backgroundColor: colors.background.card,
                        borderColor: colors.border.primary,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.infoTitle, { color: colors.text.primary }]}
                    >
                      Available Cities
                    </Text>
                    <Text
                      style={[
                        styles.infoText,
                        { color: colors.text.secondary },
                      ]}
                    >
                      New York, London, Dubai, Tokyo, Paris, Sydney, Mumbai,
                      Cairo, Toronto, Berlin
                    </Text>
                    <Text
                      style={[
                        styles.infoSubtext,
                        { color: colors.text.tertiary },
                      ]}
                    >
                      Try searching for any of these cities to see their current
                      weather
                    </Text>
                  </View>
                </ScrollView>
              )}
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
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
    paddingBottom: Spacing.responsive.lg,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.responsive.lg,
    marginHorizontal: Spacing.responsive.base,
    marginTop: Spacing.responsive.base,
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
    borderWidth: 1,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: Spacing.responsive.lg,
  },
  headerLeft: {
    flex: 1,
  },

  temperatureToggle: {
    marginRight: 0,
  },
  title: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral[900],
    marginTop: Spacing.md,
    letterSpacing: Typography.letterSpacing.tight,
  },
  searchContainer: {
    padding: Spacing.responsive.lg,
    margin: Spacing.responsive.base,
    borderRadius: BorderRadius.xl,
    ...Shadows.lg,
    borderWidth: 1,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderWidth: 2,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    fontSize: Typography.fontSize.base,
    marginRight: Spacing.md,
    ...Shadows.sm,
  },
  searchButton: {
    backgroundColor: Colors.primary[500],
    height: 50,
    width: 50,
    borderRadius: BorderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.md,
  },
  searchButtonDisabled: {
    backgroundColor: Colors.neutral[400],
  },
  clearButton: {
    alignSelf: "flex-end",
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  clearButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  recentContainer: {
    ...GlassMorphism.light,
    margin: Spacing.responsive.base,
    borderRadius: BorderRadius.xl,
    padding: Spacing.responsive.lg,
    ...Shadows.md,
    borderWidth: 0,
  },
  recentTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.neutral[900],
    marginBottom: Spacing.lg,
    letterSpacing: Typography.letterSpacing.tight,
  },
  recentList: {
    gap: 8,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.neutral[100],
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  recentText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.neutral[800],
    fontWeight: Typography.fontWeight.medium,
  },
  resultContainer: {
    margin: Spacing.responsive.base,
    borderRadius: BorderRadius.xl,
    padding: Spacing.responsive.lg,
    ...Shadows.lg,
    borderWidth: 1,
  },
  resultTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.neutral[900],
    marginBottom: Spacing.lg,
    textAlign: "center",
    letterSpacing: Typography.letterSpacing.tight,
  },
  infoContainer: {
    margin: Spacing.responsive.base,
    borderRadius: BorderRadius.xl,
    padding: Spacing.responsive.lg,
    ...Shadows.md,
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.neutral[900],
    marginBottom: Spacing.md,
    letterSpacing: Typography.letterSpacing.tight,
  },
  infoText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral[600],
    lineHeight: Typography.lineHeight.relaxed,
    marginBottom: Spacing.sm,
  },
  infoSubtext: {
    fontSize: Typography.fontSize.xs,
    color: Colors.neutral[500],
    fontStyle: "italic",
    lineHeight: Typography.lineHeight.normal,
  },
});
