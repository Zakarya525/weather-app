import { LoadingSpinner } from "@/components/LoadingSpinner";
import { TemperatureToggle } from "@/components/TemperatureToggle";
import { WeatherCard } from "@/components/WeatherCard";
import { useFavorites } from "@/contexts/FavoritesContext";
import { WeatherData } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function FavoritesScreen() {
  const { favorites, loading, removeFromFavorites, clearAllFavorites } =
    useFavorites();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Since favorites are stored locally, we just need to simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleCityPress = useCallback((city: string) => {
    Alert.alert("City Selected", `You selected ${city}`);
  }, []);

  const handleRemoveFromFavorites = useCallback(
    async (weather: WeatherData) => {
      try {
        await removeFromFavorites(weather.id);
        Alert.alert(
          "Removed",
          `${weather.city} has been removed from favorites`
        );
      } catch (error) {
        Alert.alert("Error", "Failed to remove from favorites");
      }
    },
    [removeFromFavorites]
  );

  const handleClearAllFavorites = useCallback(() => {
    if (favorites.length === 0) return;

    Alert.alert(
      "Clear All Favorites",
      "Are you sure you want to remove all cities from your favorites?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllFavorites();
              Alert.alert("Cleared", "All favorites have been removed");
            } catch (error) {
              Alert.alert("Error", "Failed to clear favorites");
            }
          },
        },
      ]
    );
  }, [favorites.length, clearAllFavorites]);

  const renderWeatherCard = useCallback(
    ({ item }: { item: WeatherData }) => (
      <View style={styles.cardContainer}>
        <WeatherCard
          weather={item}
          onPress={() => handleCityPress(item.city)}
          isCompact={screenWidth < 400}
        />
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFromFavorites(item)}
          activeOpacity={0.7}
        >
          <Ionicons name="heart-dislike" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    ),
    [handleCityPress, handleRemoveFromFavorites]
  );

  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Ionicons name="heart-outline" size={80} color="#CCC" />
        <Text style={styles.emptyTitle}>No Favorites Yet</Text>
        <Text style={styles.emptyText}>
          Add cities to your favorites by tapping the heart icon on weather
          cards
        </Text>
        <Text style={styles.emptySubtext}>
          Go to the Weather or Search tabs to find cities to favorite
        </Text>
      </View>
    ),
    []
  );

  const renderHeader = useCallback(
    () => (
      <View style={styles.listHeader}>
        <Text style={styles.favoritesCount}>
          {favorites.length} {favorites.length === 1 ? "city" : "cities"} in
          favorites
        </Text>
        {favorites.length > 0 && (
          <TouchableOpacity
            style={styles.clearAllButton}
            onPress={handleClearAllFavorites}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={18} color="#FF3B30" />
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
    ),
    [favorites.length, handleClearAllFavorites]
  );

  if (loading) {
    return <LoadingSpinner message="Loading favorites..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Ionicons
              name="heart"
              size={Math.max(32, screenWidth * 0.08)}
              color="#FF3B30"
            />
          </View>
          <TemperatureToggle style={styles.temperatureToggle} />
        </View>
        <Text style={styles.title}>Favorite Cities</Text>
        <Text style={styles.subtitle}>
          Your personalized weather collection
        </Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderWeatherCard}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          favorites.length === 0 && styles.emptyListContainer,
        ]}
        ListHeaderComponent={favorites.length > 0 ? renderHeader : null}
        ListEmptyComponent={renderEmptyState}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        numColumns={1}
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
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
    paddingBottom: 16,
  },
  favoritesCount: {
    fontSize: Math.max(16, screenWidth * 0.04),
    fontWeight: "600",
    color: "#333",
  },
  clearAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FFF5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFE5E5",
    gap: 6,
  },
  clearAllText: {
    fontSize: Math.max(14, screenWidth * 0.035),
    color: "#FF3B30",
    fontWeight: "500",
  },
  cardContainer: {
    position: "relative",
  },
  removeButton: {
    position: "absolute",
    top: 16,
    right: Math.max(24, screenWidth * 0.06),
    backgroundColor: "white",
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Math.max(40, screenHeight * 0.05),
    paddingHorizontal: Math.max(20, screenWidth * 0.05),
  },
  emptyTitle: {
    fontSize: Math.max(24, screenWidth * 0.06),
    fontWeight: "600",
    color: "#666",
    marginTop: 24,
    marginBottom: 12,
    textAlign: "center",
  },
  emptyText: {
    fontSize: Math.max(16, screenWidth * 0.04),
    color: "#999",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 24,
  },
  emptySubtext: {
    fontSize: Math.max(14, screenWidth * 0.035),
    color: "#BBB",
    textAlign: "center",
    fontStyle: "italic",
  },
});
