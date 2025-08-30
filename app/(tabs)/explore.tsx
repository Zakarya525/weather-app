import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo, useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Components
import BlurHeader from "@/components/BlurHeader";
import { OfflineBanner } from "@/components/OfflineBanner";
import { RecentSearches } from "@/components/RecentSearches";
import { TemperatureToggle } from "@/components/TemperatureToggle";
import { WeatherCard } from "@/components/WeatherCard";
import { WeatherGradient } from "@/components/WeatherGradient";

// Constants and Design System
import {
  Animations,
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/DesignSystem";

// Contexts and Hooks
import { useTheme } from "@/contexts/ThemeContext";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { useScrollBlur } from "@/hooks/useScrollBlur";

// Utils
import { fetchWeatherByCity, WeatherData } from "@/utils/api";
import { isConnected } from "@/utils/networkAndCache";

const { width: screenWidth } = Dimensions.get("window");

// Types
interface SearchButtonProps {
  searching: boolean;
  onPress: () => void;
}

interface ClearButtonProps {
  onPress: () => void;
  hasQuery: boolean;
  colors: any;
}

interface SearchContainerProps {
  searchQuery: string;
  searching: boolean;
  onSearch: () => void;
  onClear: () => void;
  onInputChange: (text: string) => void;
  colors: any;
}

interface WeatherResultProps {
  searchResult: WeatherData;
  onCityPress: (city: string) => void;
  colors: any;
}

// Memoized Components
const SearchButton = memo<SearchButtonProps>(({ searching, onPress }) => (
  <TouchableOpacity
    style={[styles.searchButton, searching && styles.searchButtonDisabled]}
    onPress={onPress}
    disabled={searching}
    accessibilityLabel="Search weather"
    accessibilityHint="Tap to search for weather in the entered city"
  >
    {searching ? (
      <ActivityIndicator size="small" color="white" />
    ) : (
      <Ionicons name="search" size={20} color="white" />
    )}
  </TouchableOpacity>
));

SearchButton.displayName = "SearchButton";

const ClearButton = memo<ClearButtonProps>(({ onPress, hasQuery, colors }) => {
  if (!hasQuery) return null;

  return (
    <TouchableOpacity
      style={[
        styles.clearButton,
        {
          backgroundColor: colors.background.secondary,
          borderColor: colors.border.primary,
        },
      ]}
      onPress={onPress}
      accessibilityLabel="Clear search"
      accessibilityHint="Tap to clear the search input"
    >
      <Text style={[styles.clearButtonText, { color: colors.text.secondary }]}>
        Clear
      </Text>
    </TouchableOpacity>
  );
});

ClearButton.displayName = "ClearButton";

const SearchContainer = memo<SearchContainerProps>(
  ({ searchQuery, searching, onSearch, onClear, onInputChange, colors }) => (
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
          onChangeText={onInputChange}
          onSubmitEditing={onSearch}
          returnKeyType="search"
          autoCapitalize="words"
          autoCorrect={false}
          accessibilityLabel="City search input"
          accessibilityHint="Enter a city name to search for weather information"
        />
        <SearchButton searching={searching} onPress={onSearch} />
      </View>

      <ClearButton
        onPress={onClear}
        hasQuery={searchQuery.length > 0}
        colors={colors}
      />
    </View>
  )
);

SearchContainer.displayName = "SearchContainer";

const WeatherResult = memo<WeatherResultProps>(
  ({ searchResult, onCityPress, colors }) => (
    <View
      style={[
        styles.resultContainer,
        {
          backgroundColor: colors.background.card,
          borderColor: colors.border.primary,
        },
      ]}
    >
      <Text style={[styles.resultTitle, { color: colors.text.primary }]}>
        Weather in {searchResult.city}
      </Text>

      <WeatherCard
        weather={searchResult}
        onPress={() => onCityPress(searchResult.city)}
        isCompact={false}
      />
    </View>
  )
);

WeatherResult.displayName = "WeatherResult";

// Main Component
export default function ExploreScreen() {
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<WeatherData | null>(null);
  const [searching, setSearching] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Hooks
  const { colors } = useTheme();
  const { scrollY, scrollHandler } = useScrollBlur({ threshold: 25 });
  const {
    recentSearches,
    loading: recentSearchesLoading,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  } = useRecentSearches();

  // Animation values
  const fadeValue = useState(new Animated.Value(0))[0];
  const slideValue = useState(new Animated.Value(50))[0];

  // Memoized values
  const hasSearchQuery = useMemo(() => searchQuery.length > 0, [searchQuery]);
  const shouldShowRecentSearches = useMemo(
    () => !searchResult && !recentSearchesLoading,
    [searchResult, recentSearchesLoading]
  );
  const iconSize = useMemo(
    () => Math.max(32, screenWidth * 0.08),
    [screenWidth]
  );

  // Effects
  React.useEffect(() => {
    checkConnectivity();
  }, []);

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

  // Network connectivity
  const checkConnectivity = useCallback(async () => {
    const connected = await isConnected();
    setIsOffline(!connected);
  }, []);

  // Search handlers
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      Alert.alert("Error", "Please enter a city name");
      return;
    }

    await checkConnectivity();

    try {
      setSearching(true);
      setSearchResult(null);

      const result = await fetchWeatherByCity(searchQuery.trim());

      if (result) {
        setSearchResult(result);
        setSearchQuery(result.city);
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
  }, [searchQuery, addRecentSearch]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResult(null);
  }, []);

  const handleInputChange = useCallback((text: string) => {
    if (text.length === 1) {
      setSearchQuery(text.toUpperCase());
    } else {
      setSearchQuery(text);
    }
  }, []);

  // Recent search handlers
  const handleRecentSearchPress = useCallback(
    async (city: string) => {
      try {
        await checkConnectivity();
        setSearching(true);
        setSearchResult(null);
        setSearchQuery(city);

        const result = await fetchWeatherByCity(city);

        if (result) {
          setSearchResult(result);
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

  // Refresh handler
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await checkConnectivity();

    try {
      if (searchResult) {
        const result = await fetchWeatherByCity(searchResult.city);
        if (result) {
          setSearchResult(result);
        }
      }
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  }, [searchResult]);

  const handleCityPress = useCallback((city: string) => {
    Alert.alert("City Selected", `You selected ${city}`);
  }, []);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <OfflineBanner visible={isOffline} />

      <WeatherGradient
        condition={searchResult?.condition || "partly cloudy"}
        intensity={0.2}
        style={styles.backgroundGradient}
      />

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
          {/* Header */}
          <BlurHeader
            scrollY={scrollY}
            backgroundColor={colors.background.card}
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
          </BlurHeader>

          {/* Search Section */}
          <SearchContainer
            searchQuery={searchQuery}
            searching={searching}
            onSearch={handleSearch}
            onClear={clearSearch}
            onInputChange={handleInputChange}
            colors={colors}
          />

          {/* Content Section */}
          <View style={styles.contentContainer}>
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
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={[Colors.primary[500]]}
                    tintColor={colors.text.primary}
                  />
                }
              >
                <WeatherResult
                  searchResult={searchResult}
                  onCityPress={handleCityPress}
                  colors={colors}
                />
              </ScrollView>
            )}
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

// Styles
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
});
