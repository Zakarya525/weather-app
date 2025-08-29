import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Animations,
  BorderRadius,
  Colors,
  GlassMorphism,
  Shadows,
  Spacing,
  Typography,
} from "../constants/DesignSystem";
import { useFavorites } from "../contexts/FavoritesContext";
import { useTemperature } from "../contexts/TemperatureContext";
import {
  getWeatherCardAccessibilityHint,
  getWeatherDescription,
} from "../utils/accessibility";
import { WeatherData } from "../utils/api";
import {
  getAccessibleWeatherTheme,
  getWeatherIconName,
} from "../utils/weatherTheme";
import { WeatherCardGradient } from "./WeatherGradient";

const { width: screenWidth } = Dimensions.get("window");

interface WeatherCardProps {
  weather: WeatherData;
  onPress?: () => void;
  isCompact?: boolean;
}

// Enhanced weather icon mapping using MaterialCommunityIcons for better weather representation
const getWeatherIcon = (condition: string) => {
  const iconName = getWeatherIconName(condition);
  return iconName;
};

export const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  onPress,
  isCompact = false,
}) => {
  const theme = getAccessibleWeatherTheme(weather.condition);
  const { getTemperatureDisplay } = useTemperature();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();

  // Enhanced animations
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  const fadeValue = React.useRef(new Animated.Value(0)).current;
  const glowValue = React.useRef(new Animated.Value(0)).current;
  const rotateValue = React.useRef(new Animated.Value(0)).current;

  // Accessibility labels and hints
  const accessibilityLabel = getWeatherDescription(weather);
  const accessibilityHint = getWeatherCardAccessibilityHint(
    weather.city,
    weather.condition
  );

  React.useEffect(() => {
    // Staggered entrance animation
    Animated.sequence([
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: Animations.timing.normal,
        useNativeDriver: true,
      }),
      Animated.timing(glowValue, {
        toValue: 1,
        duration: Animations.timing.slow,
        useNativeDriver: true,
      }),
    ]).start();

    // Icon rotation animation
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();
  }, [weather.condition]);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 0.95,
        ...Animations.spring.snappy,
        useNativeDriver: true,
      }),
      Animated.timing(glowValue, {
        toValue: 1.5,
        duration: Animations.timing.fast,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        ...Animations.spring.gentle,
        useNativeDriver: true,
      }),
      Animated.timing(glowValue, {
        toValue: 1,
        duration: Animations.timing.normal,
        useNativeDriver: true,
      }),
    ]).start();
  };

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
      <Animated.View
        style={[
          {
            transform: [{ scale: scaleValue }],
            opacity: fadeValue,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.compactCard,
            {
              backgroundColor: theme.cardBackgroundColor,
              shadowColor: theme.shadowColor,
            },
          ]}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
          accessible={true}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          accessibilityRole="button"
        >
          <WeatherCardGradient
            condition={weather.condition}
            style={styles.gradientOverlay}
          />
          <View style={styles.cardContent}>
            <View style={styles.compactHeader}>
              <Text
                style={[styles.compactCityName, { color: Colors.neutral[900] }]}
              >
                {weather.city}
              </Text>
              <View style={styles.compactHeaderRight}>
                <MaterialCommunityIcons
                  name={getWeatherIcon(weather.condition) as any}
                  size={24}
                  color={theme.iconColor}
                />
                <TouchableOpacity
                  style={styles.compactFavoriteButton}
                  onPress={handleFavoritePress}
                  activeOpacity={0.7}
                  accessible={true}
                  accessibilityLabel={
                    isFavorite(weather.id)
                      ? `Remove ${weather.city} from favorites`
                      : `Add ${weather.city} to favorites`
                  }
                  accessibilityRole="button"
                >
                  <Ionicons
                    name={isFavorite(weather.id) ? "star" : "star-outline"}
                    size={20}
                    color={
                      isFavorite(weather.id) ? "#FFD700" : Colors.neutral[700]
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.compactTemperatureContainer}>
              <Text
                style={[
                  styles.compactTemperature,
                  { color: theme.primaryColor },
                ]}
              >
                {getTemperatureDisplay(weather.temperature)}
              </Text>
              <Text
                style={[
                  styles.compactCondition,
                  { color: Colors.neutral[700] },
                ]}
              >
                {weather.condition}
              </Text>
            </View>

            <View style={styles.compactDetails}>
              <View style={styles.compactDetailItem}>
                <Ionicons name="water" size={14} color={theme.secondaryColor} />
                <Text
                  style={[
                    styles.compactDetailText,
                    { color: Colors.neutral[700] },
                  ]}
                >
                  {weather.humidity}%
                </Text>
              </View>
              <View style={styles.compactDetailItem}>
                <MaterialCommunityIcons
                  name="weather-windy"
                  size={14}
                  color={theme.secondaryColor}
                />
                <Text
                  style={[
                    styles.compactDetailText,
                    { color: Colors.neutral[700] },
                  ]}
                >
                  {weather.windSpeed} km/h
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleValue }],
          opacity: fadeValue,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: theme.cardBackgroundColor,
            shadowColor: theme.shadowColor,
          },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole="button"
      >
        <WeatherCardGradient
          condition={weather.condition}
          style={styles.gradientOverlay}
        />
        <View style={styles.cardContent}>
          <View style={styles.header}>
            <Text style={[styles.cityName, { color: Colors.neutral[900] }]}>
              {weather.city}
            </Text>
            <View style={styles.headerRight}>
              <MaterialCommunityIcons
                name={getWeatherIcon(weather.condition) as any}
                size={32}
                color={theme.iconColor}
              />
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={handleFavoritePress}
                activeOpacity={0.7}
                accessible={true}
                accessibilityLabel={
                  isFavorite(weather.id)
                    ? `Remove ${weather.city} from favorites`
                    : `Add ${weather.city} to favorites`
                }
                accessibilityRole="button"
              >
                <Ionicons
                  name={isFavorite(weather.id) ? "star" : "star-outline"}
                  size={24}
                  color={
                    isFavorite(weather.id) ? "#FFD700" : Colors.neutral[700]
                  }
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.temperatureContainer}>
            <Text style={[styles.temperature, { color: theme.primaryColor }]}>
              {getTemperatureDisplay(weather.temperature)}
            </Text>
            <Text style={[styles.condition, { color: Colors.neutral[700] }]}>
              {weather.condition}
            </Text>
          </View>

          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Ionicons name="water" size={16} color={theme.secondaryColor} />
              <Text style={[styles.detailText, { color: Colors.neutral[700] }]}>
                {weather.humidity}%
              </Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons
                name="weather-windy"
                size={16}
                color={theme.secondaryColor}
              />
              <Text style={[styles.detailText, { color: Colors.neutral[700] }]}>
                {weather.windSpeed} km/h
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    ...GlassMorphism.light,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginVertical: Spacing.md,
    marginHorizontal: Spacing.responsive.base,
    ...Shadows.lg,
    minHeight: 180,
    overflow: "hidden",
    position: "relative",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BorderRadius.xl,
    opacity: 0.1,
  },
  cardContent: {
    position: "relative",
    zIndex: 2,
    flex: 1,
  },
  compactCard: {
    ...GlassMorphism.light,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginVertical: Spacing.sm,
    marginHorizontal: Spacing.responsive.sm,
    ...Shadows.md,
    minHeight: 140,
    overflow: "hidden",
    position: "relative",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  compactHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  compactHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  favoriteButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    ...Shadows.sm,
  },
  compactFavoriteButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    ...Shadows.sm,
  },
  cityName: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.neutral[900],
    flex: 1,
    marginRight: Spacing.sm,
    letterSpacing: Typography.letterSpacing.tight,
  },
  compactCityName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.neutral[900],
    flex: 1,
    marginRight: Spacing.sm,
    letterSpacing: Typography.letterSpacing.tight,
  },
  temperatureContainer: {
    marginBottom: Spacing.lg,
    alignItems: "flex-start",
  },
  compactTemperatureContainer: {
    marginBottom: Spacing.md,
    alignItems: "flex-start",
  },
  temperature: {
    fontSize: Typography.fontSize["4xl"],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
    letterSpacing: Typography.letterSpacing.tight,
  },
  compactTemperature: {
    fontSize: Typography.fontSize["3xl"],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
    letterSpacing: Typography.letterSpacing.tight,
  },
  condition: {
    fontSize: Typography.fontSize.base,
    color: Colors.neutral[600],
    fontWeight: Typography.fontWeight.medium,
  },
  compactCondition: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral[600],
    fontWeight: Typography.fontWeight.medium,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  compactDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  compactDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  detailText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral[700],
    fontWeight: Typography.fontWeight.medium,
  },
  compactDetailText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.neutral[700],
    fontWeight: Typography.fontWeight.medium,
  },
});
