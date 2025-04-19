import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { ThemeToggle } from "../../components/ThemeToggle";
import { useTheme } from "../../components/ThemeProvider";
import { Movie } from "../../types/models/movie";
import * as movieService from "../../services/movies/movieService";
import * as tmdbService from "../../services/movies/tmdbService";

export default function MoviesScreen() {
  const router = useRouter();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadMovies();
  }, []);

  // Filter movies when search query changes
  useEffect(() => {
    if (searchQuery) {
      const filtered = movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(movies);
    }
  }, [searchQuery, movies]);

  const loadMovies = async () => {
    setIsLoading(true);
    try {
      const movieData = await movieService.getMovies();
      setMovies(movieData);
      setFilteredMovies(movieData);
    } catch (error) {
      console.error("Failed to load movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoviePress = (movieId: number) => {
    router.push(`/movie/${movieId}`);
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => handleMoviePress(item.id)}
    >
      <Image
        source={{ uri: item.posterUrl }}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.movieInfo}>
        <ThemedText style={styles.movieTitle}>{item.title}</ThemedText>
        <View style={styles.detailsRow}>
          <ThemedText style={styles.runtime}>
            {Math.floor(item.runtime / 60)}h {item.runtime % 60}m
          </ThemedText>
          {item.rating && (
            <View style={styles.ratingBadge}>
              <ThemedText style={styles.ratingText}>{item.rating}</ThemedText>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Movies",
          headerStyle: {
            backgroundColor: isDark ? "#1E2429" : "#FFFFFF",
          },
          headerTitleStyle: {
            color: isDark ? "#FFFFFF" : "#242424",
          },
        }}
      />

      <ThemedView style={styles.container}>
        {/* Search bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color={isDark ? "#BBBBBB" : "#666666"}
            style={styles.searchIcon}
          />
          <TextInput
            style={[
              styles.searchInput,
              { color: isDark ? "#FFFFFF" : "#242424" },
            ]}
            placeholder="Search movies..."
            placeholderTextColor={isDark ? "#999999" : "#999999"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery("")}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={isDark ? "#BBBBBB" : "#666666"}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#B4D335" />
            <ThemedText style={styles.loadingText}>
              Loading movies...
            </ThemedText>
          </View>
        ) : filteredMovies.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Ionicons
              name="film-outline"
              size={60}
              color={isDark ? "#666666" : "#BBBBBB"}
            />
            <ThemedText style={styles.emptyStateText}>
              {searchQuery
                ? "No movies found matching your search."
                : "No movies available at this time."}
            </ThemedText>
            {searchQuery && (
              <TouchableOpacity
                style={styles.clearSearchButton}
                onPress={() => setSearchQuery("")}
              >
                <ThemedText style={styles.clearSearchText}>
                  Clear Search
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <FlatList
            data={filteredMovies}
            renderItem={renderMovieItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}

        <ThemeToggle position="bottomRight" size={40} />
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#262D33",
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    color: "#9BA1A6",
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  movieCard: {
    flexDirection: "row",
    backgroundColor: "#262D33",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  poster: {
    width: 80,
    height: 120,
  },
  movieInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  runtime: {
    fontSize: 14,
    color: "#9BA1A6",
    marginRight: 12,
  },
  ratingBadge: {
    backgroundColor: "#1E3A55",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  ratingText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#9BA1A6",
    marginTop: 16,
    marginBottom: 16,
    textAlign: "center",
  },
  clearSearchButton: {
    backgroundColor: "#B4D335",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  clearSearchText: {
    color: "#242424",
    fontWeight: "bold",
  },
});
