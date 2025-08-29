import { useTheme } from "@/contexts/ThemeContext";
import { RecentSearch } from "@/hooks/useRecentSearches";
import { Ionicons } from "@expo/vector-icons";
import { memo, useCallback } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

interface RecentSearchesProps {
  recentSearches: RecentSearch[];
  onSearchPress: (city: string) => void;
  onClearAll: () => void;
  onRemoveSearch: (searchId: string) => void;
}

interface RecentSearchItemProps {
  item: RecentSearch;
  onPress: (city: string) => void;
  onRemove: (searchId: string) => void;
}

// Memoized individual search item component
const RecentSearchItem = memo<RecentSearchItemProps>(
  ({ item, onPress, onRemove }) => {
    const { colors } = useTheme();
    const handlePress = useCallback(() => {
      onPress(item.city);
    }, [item.city, onPress]);

    const handleRemove = useCallback(() => {
      onRemove(item.id);
    }, [item.id, onRemove]);

    const formatTimestamp = useCallback((timestamp: number) => {
      const now = Date.now();
      const diff = now - timestamp;
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (minutes < 1) return "Just now";
      if (minutes < 60) return `${minutes}m ago`;
      if (hours < 24) return `${hours}h ago`;
      return `${days}d ago`;
    }, []);

    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          style={[
            styles.recentItem,
            {
              backgroundColor: colors.background.secondary,
              borderColor: colors.border.primary,
            },
          ]}
          onPress={handlePress}
        >
          <View style={styles.recentItemContent}>
            <Ionicons
              name="location-outline"
              size={16}
              color={colors.icon.secondary}
            />
            <Text style={[styles.recentText, { color: colors.text.primary }]}>
              {item.city}
            </Text>
            <Text
              style={[styles.timestampText, { color: colors.text.tertiary }]}
            >
              {formatTimestamp(item.timestamp)}
            </Text>
          </View>
          <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
            <Ionicons
              name="close-circle"
              size={18}
              color={colors.icon.secondary}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  }
);

RecentSearchItem.displayName = "RecentSearchItem";

// Main RecentSearches component
export const RecentSearches = memo<RecentSearchesProps>(
  ({ recentSearches, onSearchPress, onClearAll, onRemoveSearch }) => {
    const { colors } = useTheme();
    const handleClearAll = useCallback(() => {
      Alert.alert(
        "Clear Recent Searches",
        "Are you sure you want to clear all recent searches?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Clear All", style: "destructive", onPress: onClearAll },
        ]
      );
    }, [onClearAll]);

    const renderItem = useCallback(
      ({ item }: { item: RecentSearch }) => (
        <RecentSearchItem
          item={item}
          onPress={onSearchPress}
          onRemove={onRemoveSearch}
        />
      ),
      [onSearchPress, onRemoveSearch]
    );

    const keyExtractor = useCallback((item: RecentSearch) => item.id, []);

    const ListHeaderComponent = useCallback(
      () => (
        <View style={styles.itemContainer}>
          <View style={styles.headerContainer}>
            <Text style={[styles.recentTitle, { color: colors.text.primary }]}>
              Recent Searches
            </Text>
            {recentSearches.length > 0 && (
              <TouchableOpacity
                onPress={handleClearAll}
                style={[
                  styles.clearAllButton,
                  {
                    backgroundColor: colors.background.secondary,
                    borderColor: colors.border.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.clearAllText,
                    { color: colors.text.secondary },
                  ]}
                >
                  Clear All
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ),
      [recentSearches.length, handleClearAll, colors]
    );

    const ListEmptyComponent = useCallback(
      () => (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={32} color={colors.icon.secondary} />
          <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
            No recent searches
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.text.tertiary }]}>
            Your search history will appear here
          </Text>
        </View>
      ),
      [colors]
    );

    if (recentSearches.length === 0) {
      return null; // Don't show the component if there are no recent searches
    }

    return (
      <FlatList
        style={[
          styles.container,
          {
            backgroundColor: colors.background.card,
            borderColor: colors.border.primary,
          },
        ]}
        data={recentSearches}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={10}
        initialNumToRender={5}
        getItemLayout={(data, index) => ({
          length: 80,
          offset: 80 * index,
          index,
        })}
      />
    );
  }
);

RecentSearches.displayName = "RecentSearches";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    marginHorizontal: Math.max(16, screenWidth * 0.04),
    marginVertical: 8,
    borderWidth: 1,
  },
  listContent: {
    paddingVertical: 8,
  },
  itemContainer: {
    marginHorizontal: Math.max(8, screenWidth * 0.02),
    marginVertical: 4,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Math.max(20, screenWidth * 0.05),
  },
  recentTitle: {
    fontSize: Math.max(18, screenWidth * 0.045),
    fontWeight: "600",
  },
  clearAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  clearAllText: {
    fontSize: Math.max(14, screenWidth * 0.035),
    fontWeight: "500",
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Math.max(20, screenWidth * 0.05),
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 4,
  },
  recentItemContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  recentText: {
    flex: 1,
    fontSize: Math.max(16, screenWidth * 0.04),
    fontWeight: "500",
  },
  timestampText: {
    fontSize: Math.max(12, screenWidth * 0.03),
  },
  removeButton: {
    padding: 4,
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: Math.max(16, screenWidth * 0.04),
    marginTop: 12,
    fontWeight: "500",
  },
  emptySubtext: {
    fontSize: Math.max(14, screenWidth * 0.035),
    marginTop: 4,
  },
});
