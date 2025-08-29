import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
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
import { fetchWeatherData, WeatherData } from "@/utils/api";
import { getAccessibleWeatherTheme } from "@/utils/weatherTheme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function HomeScreen() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentWeatherIndex, setCurrentWeatherIndex] = useState(0);
  const { colors } = useTheme();

  // Enhanced animations
  const fadeValue = useState(new Animated.Value(1))[0];
  const headerSlideValue = useState(new Animated.Value(-100))[0];
  const cardStaggerValue = useState(new Animated.Value(0))[0];

  // Get the current weather condition for background theming
  const currentWeather = weatherData[currentWeatherIndex];
  const currentTheme = currentWeather
    ? getAccessibleWeatherTheme(currentWeather.condition)
    : getAccessibleWeatherTheme("partly cloudy");

  const loadWeatherData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeatherData();
      setWeatherData(data);

      // Animate header entrance
      Animated.sequence([
        Animated.timing(headerSlideValue, {
          toValue: 0,
          duration: Animations.timing.normal,
          useNativeDriver: true,
        }),
        Animated.stagger(100, [
          Animated.timing(cardStaggerValue, {
            toValue: 1,
            duration: Animations.timing.slow,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load weather data";
      setError(errorMessage);
      console.error("Error loading weather data:", error);
    } finally {
      setLoading(false);
    }
  }, [headerSlideValue, cardStaggerValue]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadWeatherData();
    setRefreshing(false);
  }, [loadWeatherData]);

  useEffect(() => {
    loadWeatherData();
  }, [loadWeatherData]);

  const handleCityPress = useCallback(
    (city: string, index: number) => {
      // Update the current weather index for background theming
      setCurrentWeatherIndex(index);

      // Animate background transition
      Animated.sequence([
        Animated.timing(fadeValue, {
          toValue: 0.7,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      console.log(`City selected: ${city}`);
    },
    [fadeValue]
  );

  const renderWeatherCard = useCallback(
    ({ item, index }: { item: WeatherData; index: number }) => (
      <WeatherCard
        weather={item}
        onPress={() => handleCityPress(item.city, index)}
        isCompact={screenWidth < 400}
      />
    ),
    [handleCityPress]
  );

  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="cloud-offline"
          size={64}
          color={colors.icon.secondary}
        />
        <Text style={[styles.emptyTitle, { color: colors.text.secondary }]}>
          No Weather Data
        </Text>
        <Text style={[styles.emptyText, { color: colors.text.tertiary }]}>
          Pull down to refresh or check your connection
        </Text>
      </View>
    ),
    [colors]
  );

  if (loading) {
    return <LoadingSpinner message="Loading weather data..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to Load Weather"
        message={error}
        onRetry={loadWeatherData}
        retryText="Retry"
      />
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <WeatherGradient
        condition={currentWeather?.condition || "partly cloudy"}
        intensity={0.3}
        style={styles.backgroundGradient}
      />
      <Animated.View style={[styles.contentContainer, { opacity: fadeValue }]}>
        <SafeAreaView style={styles.safeArea}>
          <Animated.View
            style={[
              styles.header,
              {
                backgroundColor: colors.background.card,
                borderColor: colors.border.primary,
                transform: [{ translateY: headerSlideValue }],
              },
            ]}
          >
            <View style={styles.headerTop}>
              <View style={styles.headerLeft}>
                <MaterialCommunityIcons
                  name={
                    currentWeather
                      ? currentWeather.condition.toLowerCase().includes("sunny")
                        ? "weather-sunny"
                        : currentWeather.condition
                            .toLowerCase()
                            .includes("rain")
                        ? "weather-rainy"
                        : currentWeather.condition
                            .toLowerCase()
                            .includes("cloud")
                        ? "weather-cloudy"
                        : "weather-partly-cloudy"
                      : "weather-partly-cloudy"
                  }
                  size={Math.max(32, screenWidth * 0.08)}
                  color={currentTheme.primaryColor}
                />
              </View>
              <TemperatureToggle style={styles.temperatureToggle} />
            </View>
            <Text style={[styles.title, { color: colors.text.primary }]}>
              Weather App
            </Text>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              {weatherData.length} cities available
            </Text>
          </Animated.View>

          <FlatList
            data={weatherData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderWeatherCard}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={currentTheme.primaryColor}
                colors={[currentTheme.primaryColor]}
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={renderEmptyState}
            initialNumToRender={5}
            maxToRenderPerBatch={10}
            windowSize={10}
            removeClippedSubviews={true}
          />
        </SafeAreaView>
      </Animated.View>
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
  contentContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    ...GlassMorphism.light,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.responsive.lg,
    marginHorizontal: Spacing.responsive.base,
    marginTop: Spacing.responsive.base,
    borderRadius: BorderRadius.xl,
    ...Shadows.md,
    borderWidth: 0,
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
    fontSize: Typography.fontSize["3xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.neutral[900],
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    letterSpacing: Typography.letterSpacing.tight,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.neutral[600],
    fontWeight: Typography.fontWeight.medium,
  },
  listContainer: {
    paddingVertical: Spacing.responsive.lg,
    paddingBottom: Spacing.responsive["2xl"],
    paddingHorizontal: Spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.responsive["3xl"],
    paddingHorizontal: Spacing.responsive.lg,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.neutral[600],
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
    color: Colors.neutral[500],
    textAlign: "center",
    lineHeight: Typography.lineHeight.relaxed,
  },
});
