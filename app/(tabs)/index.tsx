import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { WeatherCard } from "@/components/WeatherCard";
import { fetchWeatherData, WeatherData } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
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

  const loadWeatherData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeatherData();
      setWeatherData(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load weather data";
      setError(errorMessage);
      console.error("Error loading weather data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadWeatherData();
    setRefreshing(false);
  }, [loadWeatherData]);

  useEffect(() => {
    loadWeatherData();
  }, [loadWeatherData]);

  const handleCityPress = useCallback((city: string) => {
    // You can navigate to a detailed view here
    console.log(`City selected: ${city}`);
  }, []);

  const renderWeatherCard = useCallback(
    ({ item }: { item: WeatherData }) => (
      <WeatherCard
        weather={item}
        onPress={() => handleCityPress(item.city)}
        isCompact={screenWidth < 400}
      />
    ),
    [handleCityPress]
  );

  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Ionicons name="cloud-offline" size={64} color="#CCC" />
        <Text style={styles.emptyTitle}>No Weather Data</Text>
        <Text style={styles.emptyText}>
          Pull down to refresh or check your connection
        </Text>
      </View>
    ),
    []
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="partly-sunny"
          size={Math.max(32, screenWidth * 0.08)}
          color="#4A90E2"
        />
        <Text style={styles.title}>Weather App</Text>
        <Text style={styles.subtitle}>
          {weatherData.length} cities available
        </Text>
      </View>

      <FlatList
        data={weatherData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderWeatherCard}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
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
    marginTop: 12,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Math.max(14, screenWidth * 0.035),
    color: "#666",
    fontWeight: "400",
  },
  listContainer: {
    paddingVertical: Math.max(16, screenHeight * 0.02),
    paddingBottom: Math.max(20, screenHeight * 0.025),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Math.max(40, screenHeight * 0.05),
  },
  emptyTitle: {
    fontSize: Math.max(20, screenWidth * 0.05),
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: Math.max(14, screenWidth * 0.035),
    color: "#999",
    textAlign: "center",
    paddingHorizontal: Math.max(20, screenWidth * 0.05),
  },
});
