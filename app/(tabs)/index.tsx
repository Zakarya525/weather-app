import { WeatherCard } from "@/components/WeatherCard";
import { fetchWeatherData, WeatherData } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadWeatherData = async () => {
    try {
      setLoading(true);
      const data = await fetchWeatherData();
      setWeatherData(data);
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to load weather data. Please check your connection."
      );
      console.error("Error loading weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWeatherData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadWeatherData();
  }, []);

  const handleCityPress = (city: string) => {
    Alert.alert("City Selected", `You selected ${city}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="cloud" size={64} color="#4A90E2" />
        <Text style={styles.loadingText}>Loading weather data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="partly-sunny" size={32} color="#4A90E2" />
        <Text style={styles.title}>Weather App</Text>
      </View>

      <FlatList
        data={weatherData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <WeatherCard
            weather={item}
            onPress={() => handleCityPress(item.city)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
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
  listContainer: {
    paddingVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
    marginTop: 16,
  },
});
