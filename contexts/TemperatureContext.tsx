import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type TemperatureUnit = "celsius" | "fahrenheit";

interface TemperatureContextType {
  unit: TemperatureUnit;
  toggleUnit: () => void;
  convertTemperature: (temp: number, fromUnit?: TemperatureUnit) => number;
  getTemperatureDisplay: (temp: number, fromUnit?: TemperatureUnit) => string;
}

const TemperatureContext = createContext<TemperatureContextType | undefined>(
  undefined
);

const STORAGE_KEY = "@temperature_unit";

export const TemperatureProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [unit, setUnit] = useState<TemperatureUnit>("celsius");
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved preference on mount
  useEffect(() => {
    const loadPreference = async () => {
      try {
        const savedUnit = await AsyncStorage.getItem(STORAGE_KEY);
        if (
          savedUnit &&
          (savedUnit === "celsius" || savedUnit === "fahrenheit")
        ) {
          setUnit(savedUnit as TemperatureUnit);
        }
      } catch (error) {
        console.error("Failed to load temperature unit preference:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadPreference();
  }, []);

  // Save preference when unit changes
  const toggleUnit = async () => {
    const newUnit = unit === "celsius" ? "fahrenheit" : "celsius";
    setUnit(newUnit);

    try {
      await AsyncStorage.setItem(STORAGE_KEY, newUnit);
    } catch (error) {
      console.error("Failed to save temperature unit preference:", error);
    }
  };

  // Convert temperature from one unit to another
  const convertTemperature = (
    temp: number,
    fromUnit: TemperatureUnit = "celsius"
  ): number => {
    if (unit === fromUnit) {
      return temp;
    }

    if (fromUnit === "celsius" && unit === "fahrenheit") {
      // Convert Celsius to Fahrenheit: °F = (°C × 9/5) + 32
      return Math.round((temp * 9) / 5 + 32);
    } else if (fromUnit === "fahrenheit" && unit === "celsius") {
      // Convert Fahrenheit to Celsius: °C = (°F - 32) × 5/9
      return Math.round(((temp - 32) * 5) / 9);
    }

    return temp;
  };

  // Get formatted temperature display
  const getTemperatureDisplay = (
    temp: number,
    fromUnit: TemperatureUnit = "celsius"
  ): string => {
    const convertedTemp = convertTemperature(temp, fromUnit);
    const unitSymbol = unit === "celsius" ? "°C" : "°F";
    return `${convertedTemp}${unitSymbol}`;
  };

  // Don't render children until we've loaded the saved preference
  if (!isInitialized) {
    return null;
  }

  return (
    <TemperatureContext.Provider
      value={{
        unit,
        toggleUnit,
        convertTemperature,
        getTemperatureDisplay,
      }}
    >
      {children}
    </TemperatureContext.Provider>
  );
};

export const useTemperature = (): TemperatureContextType => {
  const context = useContext(TemperatureContext);
  if (context === undefined) {
    throw new Error("useTemperature must be used within a TemperatureProvider");
  }
  return context;
};
