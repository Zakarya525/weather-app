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
        <TouchableOpacity style={styles.recentItem} onPress={handlePress}>
          <View style={styles.recentItemContent}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.recentText}>{item.city}</Text>
            <Text style={styles.timestampText}>
              {formatTimestamp(item.timestamp)}
            </Text>
          </View>
          <TouchableOpacity style={styles.removeButton} onPress={handleRemove}>
            <Ionicons name="close-circle" size={18} color="#999" />
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
            <Text style={styles.recentTitle}>Recent Searches</Text>
            {recentSearches.length > 0 && (
              <TouchableOpacity
                onPress={handleClearAll}
                style={styles.clearAllButton}
              >
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ),
      [recentSearches.length, handleClearAll]
    );

    const ListEmptyComponent = useCallback(
      () => (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={32} color="#ccc" />
          <Text style={styles.emptyText}>No recent searches</Text>
          <Text style={styles.emptySubtext}>
            Your search history will appear here
          </Text>
        </View>
      ),
      []
    );

    if (recentSearches.length === 0) {
      return null; // Don't show the component if there are no recent searches
    }

    return (
      <FlatList
        style={styles.container}
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
    backgroundColor: "#F5F5F5",
  },
  listContent: {
    paddingVertical: 8,
  },
  itemContainer: {
    backgroundColor: "white",
    marginHorizontal: Math.max(16, screenWidth * 0.04),
    marginVertical: 4,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2.84,
    elevation: 3,
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
    color: "#333",
  },
  clearAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearAllText: {
    fontSize: Math.max(14, screenWidth * 0.035),
    color: "#FF6B6B",
    fontWeight: "500",
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Math.max(20, screenWidth * 0.05),
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
    color: "#333",
    fontWeight: "500",
  },
  timestampText: {
    fontSize: Math.max(12, screenWidth * 0.03),
    color: "#999",
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
    color: "#999",
    marginTop: 12,
    fontWeight: "500",
  },
  emptySubtext: {
    fontSize: Math.max(14, screenWidth * 0.035),
    color: "#ccc",
    marginTop: 4,
  },
});
