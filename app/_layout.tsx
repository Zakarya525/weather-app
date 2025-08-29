import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { TemperatureProvider } from "@/contexts/TemperatureContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { useColorScheme } from "@/hooks/useColorScheme";

function AppContent() {
  const { isDarkActive } = useTheme();

  return (
    <NavigationThemeProvider value={isDarkActive ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={isDarkActive ? "light" : "dark"} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <TemperatureProvider>
          <FavoritesProvider>
            <AppContent />
          </FavoritesProvider>
        </TemperatureProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
