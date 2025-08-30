import BlurHeader from "@/components/BlurHeader";
import { TemperatureToggle } from "@/components/TemperatureToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { WeatherGradient } from "@/components/WeatherGradient";
import {
  Animations,
  BorderRadius,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/DesignSystem";
import { useTheme } from "@/contexts/ThemeContext";
import { useScrollBlur } from "@/hooks/useScrollBlur";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function SettingsScreen() {
  const { colors, activeTheme } = useTheme();
  const { scrollY, scrollHandler } = useScrollBlur({
    threshold: 25,
  });

  // Animation values
  const fadeValue = useState(new Animated.Value(0))[0];

  React.useEffect(() => {
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: Animations.timing.normal,
      useNativeDriver: true,
    }).start();
  }, []);

  const SettingsSection: React.FC<{
    title: string;
    icon: string;
    children: React.ReactNode;
  }> = ({ title, icon, children }) => (
    <View
      style={[
        styles.section,
        {
          backgroundColor: colors.background.card,
          borderColor: colors.border.primary,
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Ionicons name={icon as any} size={24} color={colors.icon.accent} />
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            {title}
          </Text>
        </View>
      </View>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  const InfoItem: React.FC<{
    label: string;
    value: string;
    icon: string;
  }> = ({ label, value, icon }) => (
    <View style={styles.infoItem}>
      <View style={styles.infoLeft}>
        <MaterialCommunityIcons
          name={icon as any}
          size={20}
          color={colors.icon.secondary}
        />
        <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
          {label}
        </Text>
      </View>
      <Text style={[styles.infoValue, { color: colors.text.primary }]}>
        {value}
      </Text>
    </View>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <WeatherGradient
        condition="partly cloudy"
        intensity={0.15}
        style={styles.backgroundGradient}
      />
      <Animated.View style={[styles.contentContainer, { opacity: fadeValue }]}>
        {/* Header */}
        <BlurHeader scrollY={scrollY} backgroundColor={colors.background.card}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Ionicons
                name="settings"
                size={Math.max(32, screenWidth * 0.08)}
                color={colors.icon.accent}
              />
            </View>
          </View>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            Settings
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Customize your weather experience
          </Text>
        </BlurHeader>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          {/* Theme Settings */}
          <SettingsSection title="Appearance" icon="color-palette">
            <ThemeToggle />
          </SettingsSection>

          {/* Temperature Settings */}
          <SettingsSection title="Temperature" icon="thermometer">
            <View style={styles.temperatureSection}>
              <Text
                style={[
                  styles.settingDescription,
                  { color: colors.text.secondary },
                ]}
              >
                Choose your preferred temperature unit for weather display.
              </Text>
              <TemperatureToggle />
            </View>
          </SettingsSection>

          {/* App Information */}
          <SettingsSection title="About" icon="information-circle">
            <View style={styles.aboutSection}>
              <InfoItem label="Version" value="1.0.0" icon="tag" />
              <InfoItem
                label="Current Theme"
                value={activeTheme === "light" ? "Light Mode" : "Dark Mode"}
                icon="theme-light-dark"
              />
              <InfoItem
                label="Last Updated"
                value={new Date().toLocaleDateString()}
                icon="calendar"
              />
            </View>
          </SettingsSection>

          {/* Support Section */}
          <SettingsSection title="Support" icon="help-circle">
            <View style={styles.supportSection}>
              <TouchableOpacity
                style={[
                  styles.supportButton,
                  {
                    backgroundColor: colors.background.secondary,
                    borderColor: colors.border.primary,
                  },
                ]}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="email"
                  size={20}
                  color={colors.icon.secondary}
                />
                <Text
                  style={[
                    styles.supportButtonText,
                    { color: colors.text.primary },
                  ]}
                >
                  Contact Support
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.icon.secondary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.supportButton,
                  {
                    backgroundColor: colors.background.secondary,
                    borderColor: colors.border.primary,
                  },
                ]}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="star"
                  size={20}
                  color={colors.icon.secondary}
                />
                <Text
                  style={[
                    styles.supportButtonText,
                    { color: colors.text.primary },
                  ]}
                >
                  Rate This App
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.icon.secondary}
                />
              </TouchableOpacity>
            </View>
          </SettingsSection>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.responsive.lg,
    marginHorizontal: 0, // Remove left/right margins for full-width
    marginTop: 0,
    paddingTop:
      Platform.OS === "ios" ? 60 : (StatusBar.currentHeight || 0) + 20,
    borderRadius: 0, // Remove border radius for full-width
    ...Shadows.md,
    borderWidth: 1,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: Math.max(20, screenWidth * 0.05),
  },
  headerLeft: {
    alignItems: "center",
  },
  title: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
    letterSpacing: Typography.letterSpacing.tight,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: Spacing.responsive.base,
    paddingBottom: Spacing.responsive["3xl"],
  },
  section: {
    marginHorizontal: Spacing.responsive.base,
    marginVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
    borderWidth: 1,
    overflow: "hidden",
  },
  sectionHeader: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.05)",
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semiBold,
    letterSpacing: Typography.letterSpacing.tight,
  },
  sectionContent: {
    padding: Spacing.lg,
  },
  temperatureSection: {
    gap: Spacing.md,
  },
  settingDescription: {
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
    marginBottom: Spacing.sm,
  },
  aboutSection: {
    gap: Spacing.sm,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    flex: 1,
  },
  infoLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  infoValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semiBold,
  },
  supportSection: {
    gap: Spacing.sm,
  },
  supportButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.md,
  },
  supportButtonText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
});
