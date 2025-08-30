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
import { useTheme } from "../contexts/ThemeContext";
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
  const { colors, shadows } = useTheme();

  // Refined animations
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  const fadeValue = React.useRef(new Animated.Value(0)).current;
  const glowValue = React.useRef(new Animated.Value(0)).current;

  const accessibilityLabel = getWeatherDescription(weather);
  const accessibilityHint = getWeatherCardAccessibilityHint(
    weather.city,
    weather.condition
  );

  React.useEffect(() => {
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
  }, [weather.condition]);

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 0.98,
        ...Animations.spring.snappy,
        useNativeDriver: true,
      }),
      Animated.timing(glowValue, {
        toValue: 1.2,
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
    e.stopPropagation();

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
              backgroundColor: colors.background.card,
              shadowColor: shadows.shadowColor,
              borderColor: colors.border.primary,
            },
          ]}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.95}
          accessible={true}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
          accessibilityRole="button"
        >
          <WeatherCardGradient
            condition={weather.condition}
            style={styles.gradientOverlay}
          />
          <View style={styles.compactCardContent}>
            <View style={styles.compactHeader}>
              <View style={styles.compactLeftSection}>
                <Text
                  style={[
                    styles.compactCityName,
                    { color: colors.text.primary },
                  ]}
                  numberOfLines={1}
                >
                  {weather.city}
                </Text>
                <Text
                  style={[
                    styles.compactCondition,
                    { color: colors.text.secondary },
                  ]}
                  numberOfLines={1}
                >
                  {weather.condition}
                </Text>
              </View>

              <View style={styles.compactRightSection}>
                <MaterialCommunityIcons
                  name={getWeatherIcon(weather.condition) as any}
                  size={28}
                  color={theme.iconColor}
                />
                <Text
                  style={[
                    styles.compactTemperature,
                    { color: theme.primaryColor },
                  ]}
                >
                  {getTemperatureDisplay(weather.temperature)}
                </Text>
              </View>
            </View>

            <View style={styles.compactFooter}>
              <View style={styles.compactDetailItem}>
                <Ionicons name="water" size={14} color={theme.secondaryColor} />
                <Text
                  style={[
                    styles.compactDetailText,
                    { color: colors.text.secondary },
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
                    { color: colors.text.secondary },
                  ]}
                >
                  {weather.windSpeed} km/h
                </Text>
              </View>
              <TouchableOpacity
                style={styles.compactFavoriteButton}
                onPress={handleFavoritePress}
                activeOpacity={0.8}
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
                  size={18}
                  color={
                    isFavorite(weather.id) ? "#FFD700" : colors.icon.secondary
                  }
                />
              </TouchableOpacity>
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
            backgroundColor: colors.background.card,
            shadowColor: shadows.shadowColor,
            borderColor: colors.border.primary,
          },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.95}
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
            <View style={styles.leftSection}>
              <Text
                style={[styles.cityName, { color: colors.text.primary }]}
                numberOfLines={1}
              >
                {weather.city}
              </Text>
              <Text
                style={[styles.condition, { color: colors.text.secondary }]}
              >
                {weather.condition}
              </Text>
            </View>

            <View style={styles.rightSection}>
              <MaterialCommunityIcons
                name={getWeatherIcon(weather.condition) as any}
                size={36}
                color={theme.iconColor}
              />
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={handleFavoritePress}
                activeOpacity={0.8}
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
                  size={22}
                  color={
                    isFavorite(weather.id) ? "#FFD700" : colors.icon.secondary
                  }
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.temperatureSection}>
            <Text style={[styles.temperature, { color: theme.primaryColor }]}>
              {getTemperatureDisplay(weather.temperature)}
            </Text>
          </View>

          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Ionicons name="water" size={16} color={theme.secondaryColor} />
              <Text
                style={[styles.detailText, { color: colors.text.secondary }]}
              >
                {weather.humidity}%
              </Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons
                name="weather-windy"
                size={16}
                color={theme.secondaryColor}
              />
              <Text
                style={[styles.detailText, { color: colors.text.secondary }]}
              >
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
    padding: Spacing.lg,
    marginVertical: Spacing.sm,
    marginHorizontal: Spacing.responsive.base,
    ...Shadows.lg,
    minHeight: 160,
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
    opacity: 0.08,
  },
  cardContent: {
    position: "relative",
    zIndex: 2,
    flex: 1,
  },
  compactCard: {
    ...GlassMorphism.light,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginVertical: Spacing.xs,
    marginHorizontal: Spacing.responsive.sm,
    ...Shadows.md,
    minHeight: 120,
    overflow: "hidden",
    position: "relative",
  },
  compactCardContent: {
    position: "relative",
    zIndex: 2,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  compactHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  leftSection: {
    flex: 1,
    marginRight: Spacing.md,
  },
  compactLeftSection: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  rightSection: {
    alignItems: "center",
    gap: Spacing.sm,
  },
  compactRightSection: {
    alignItems: "center",
    gap: Spacing.xs,
  },
  favoriteButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    ...Shadows.sm,
  },
  compactFavoriteButton: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    ...Shadows.sm,
  },
  cityName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.neutral[900],
    marginBottom: Spacing.xs,
    letterSpacing: Typography.letterSpacing.tight,
  },
  compactCityName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
    color: Colors.neutral[900],
    marginBottom: Spacing.xs,
    letterSpacing: Typography.letterSpacing.tight,
  },
  temperatureSection: {
    marginBottom: Spacing.md,
    alignItems: "flex-start",
  },
  temperature: {
    fontSize: Typography.fontSize["3xl"],
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: Typography.letterSpacing.tight,
  },
  compactTemperature: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: Typography.letterSpacing.tight,
  },
  condition: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral[600],
    fontWeight: Typography.fontWeight.medium,
  },
  compactCondition: {
    fontSize: Typography.fontSize.xs,
    color: Colors.neutral[600],
    fontWeight: Typography.fontWeight.medium,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  compactFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  compactDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  detailText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.neutral[700],
    fontWeight: Typography.fontWeight.medium,
  },
  compactDetailText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.neutral[700],
    fontWeight: Typography.fontWeight.medium,
  },
});
