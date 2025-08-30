# 🌦️ Weather App - React Native

A feature-rich weather application built with React Native, showcasing modern mobile development practices and user experience design. Developed for **Ninjas Code**.

![Weather App Banner](https://img.shields.io/badge/React%20Native-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## 📱 Screenshots

| Home Screen                                                                 | Search                                                                          | Favorites                                                                             | Dark Mode                                                                 |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| ![Home](https://via.placeholder.com/200x400/4A90E2/FFFFFF?text=Home+Screen) | ![Search](https://via.placeholder.com/200x400/50C878/FFFFFF?text=Search+Screen) | ![Favorites](https://via.placeholder.com/200x400/FFB347/FFFFFF?text=Favorites+Screen) | ![Dark](https://via.placeholder.com/200x400/2C3E50/FFFFFF?text=Dark+Mode) |

## ✨ Features

### 🎯 Core Features

- 🔍 **City Search** - Search for any city and get instant weather information
- 📊 **Weather Details** - Temperature, humidity, wind speed, and weather conditions
- 🌡️ **Unit Toggle** - Switch between Celsius and Fahrenheit
- ⭐ **Favorites** - Save and manage your favorite cities
- 📝 **Recent Searches** - Quick access to previously searched cities
- 📱 **Responsive Design** - Optimized for all screen sizes

### 🚀 Advanced Features

- 🌙 **Auto Light/Dark Mode** - Automatically switches based on time of day
- 📡 **Offline Mode** - Access cached weather data without internet
- 📍 **Current Location** - Get weather for your current location
- ⚡ **Performance Optimized** - Smooth scrolling with FlatList and memoization
- 💾 **Persistent Storage** - All data saved locally using AsyncStorage
- 🔄 **Pull to Refresh** - Swipe down to update weather data

### 🎨 UI/UX Features

- 🌈 **Dynamic Backgrounds** - Color themes change based on weather conditions
- ✨ **Smooth Animations** - Micro-interactions and transitions
- 🎭 **Weather Icons** - Beautiful vector icons for different weather types
- 📱 **Native Feel** - Platform-specific design patterns

## 🛠️ Tech Stack

- **Frontend:** React Native with Expo
- **Navigation:** React Navigation 6
- **State Management:** Context API
- **Storage:** AsyncStorage
- **Data Source:** JSON Server (local API simulation)
- **Icons:** React Native Vector Icons
- **Location:** React Native Geolocation Service
- **Styling:** StyleSheet with dynamic theming

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Studio (for Android development)
- Git

## 🚀 Installation & Setup

### 2️⃣ Install Dependencies

```bash
npm install
# or
yarn install
```

### 3️⃣ Install Required Packages

```bash
# Navigation
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack

# Storage & Utilities
npm install @react-async-storage/async-storage react-native-vector-icons

# Location Services
npm install react-native-geolocation-service

# Development Dependencies
npm install --save-dev json-server
```

### 4️⃣ Setup JSON Server

```bash
# Install JSON Server globally
npm install -g json-server

# Start the local API server
json-server --watch data/weatherData.json --port 3001
```

### 5️⃣ Run the Application

```bash
# Start the Expo development server
expo start

# For specific platforms
expo start --ios
expo start --android
```

### Environment Variables

Create `.env` file:

```
API_BASE_URL=http://localhost:3001
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## 🎯 Feature Implementation Guide

### Core Features Checklist

- [x] City search functionality
- [x] Weather data display from JSON server
- [x] Recent searches with AsyncStorage
- [x] Temperature unit conversion (°C/°F)
- [x] Favorites management
- [x] Responsive UI design
- [x] Error handling and loading states

### Advanced Features Checklist

- [x] Automatic light/dark mode based on time
- [x] Offline mode with cached data
- [x] Current location weather
- [x] Pull-to-refresh functionality
- [x] Smooth animations and transitions
- [x] Performance optimizations

## 🎨 Design System

### Color Palette

- **Sunny:** `#FFD700` (Gold) / `#FFA500` (Orange)
- **Cloudy:** `#708090` (Slate Gray) / `#A9A9A9` (Dark Gray)
- **Rainy:** `#4682B4` (Steel Blue) / `#1E90FF` (Dodger Blue)
- **Snowy:** `#F0F8FF` (Alice Blue) / `#E6E6FA` (Lavender)

### Typography

- **Headers:** System font, Bold, 24px
- **Body:** System font, Regular, 16px
- **Caption:** System font, Light, 14px

## 📱 Usage Instructions

### Basic Usage

1. **Search for a City:** Tap the search bar and enter a city name
2. **View Weather:** See detailed weather information including temperature, humidity, and wind speed
3. **Add to Favorites:** Tap the star icon to save cities to favorites
4. **Switch Units:** Toggle between Celsius and Fahrenheit in settings
5. **Access Recent Searches:** Tap on any recent search to quickly view weather

### Advanced Features

- **Current Location:** Tap the location icon to get weather for your current position
- **Offline Access:** Previously searched cities remain accessible without internet
- **Theme Control:** App automatically switches to dark mode in the evening
- **Pull to Refresh:** Swipe down on any screen to refresh data

## 🔧 Development

### Running Tests

```bash
npm test
# or
yarn test
```

### Building for Production

```bash
# Build for Android
expo build:android

# Build for iOS
expo build:ios
```

### Debugging

```bash
# Enable remote debugging
expo start --tunnel

# View logs
expo logs
```

## 📊 Performance Optimizations

- **FlatList** with `getItemLayout` for efficient scrolling
- **React.memo** for component memoization
- **useMemo** and **useCallback** for expensive computations
- **Lazy loading** for screens and components
- **Image optimization** for weather icons
- **Efficient AsyncStorage** operations with batch reads/writes

### Development Guidelines

- Follow React Native best practices
- Write clean, documented code
- Test on both iOS and Android
- Maintain consistent code style
- Update README for new features

## 🐛 Known Issues

- Location services may require manual permission on some Android devices
- JSON Server needs to be running for real-time data updates
- Dark mode transition might have slight delay on older devices

## 🙏 Acknowledgments

- Weather icons provided by React Native Vector Icons
- Design inspiration from modern weather applications
- Special thanks to Ninjas Code for the project requirements
- Expo team for the excellent development platform

**⭐ If you found this project helpful, please give it a star!**

Made with ❤️ for Ninjas Code
