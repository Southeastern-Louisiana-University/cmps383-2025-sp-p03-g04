import React, { useEffect, useState } from "react";
import {
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../components/AuthProvider";
import { useTheme } from "../../components/ThemeProvider";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { MovieCarousel } from "../../components/MovieCarousel";
import { TodaysShowsList } from "../../components/TodaysShowsList";
import { ThemeToggle } from "../../components/ThemeToggle";
import { UIColors } from "../../styles/theme/colors";

import * as movieService from "../../services/movies/movieService";
import * as theaterService from "../../services/theaters/theaterService";

import { Movie, Showtime } from "../../types/models/movie";
import { Theater } from "../../types/models/theater";

export default function HomeScreen() {
  const { user, isAuthenticated } = useAuth();
  const { colorScheme } = useTheme();
  const router = useRouter();
  const isDark = colorScheme === "dark";

  // State variables
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<"today" | "tomorrow">(
    "today"
  );
  const [showTheaterDropdown, setShowTheaterDropdown] = useState(false);
  const [showtimesByDate, setShowtimesByDate] = useState<
    Record<string, Showtime[]>
  >({});

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Load theater showtimes when selected theater changes
  useEffect(() => {
    if (selectedTheater) {
      loadShowtimesForTheater(selectedTheater.id);
      loadMoviesForTheater(selectedTheater.id);
    }
  }, [selectedTheater]);

  // Update showtimes displayed based on selected date
  useEffect(() => {
    if (selectedTheater && showtimesByDate) {
      const today = new Date().toISOString().split("T")[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];

      setShowtimes(
        selectedDate === "today"
          ? showtimesByDate[today] || []
          : showtimesByDate[tomorrowStr] || []
      );
    }
  }, [selectedDate, showtimesByDate]);

  // Load all theaters and set default theater
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Fetch theaters
      const theatersData = await theaterService.getTheaters();
      setTheaters(theatersData);

      // Set default theater if available
      if (theatersData.length > 0) {
        setSelectedTheater(theatersData[0]);
        // Movies and showtimes will be loaded in the useEffect when selectedTheater changes
      }
    } catch (error) {
      console.error("Failed to load data:", error);
      setTheaters([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load showtimes for a specific theater
  const loadShowtimesForTheater = async (theaterId: number) => {
    try {
      const theaterShowtimes = await movieService.getShowtimesByTheater(
        theaterId
      );

      // Organize showtimes by date
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];

      // Create date buckets
      const byDate: Record<string, Showtime[]> = {
        [today]: [],
        [tomorrowStr]: [],
      };

      // Fill the buckets
      theaterShowtimes.forEach((showtime) => {
        const showtimeDate = new Date(showtime.startTime)
          .toISOString()
          .split("T")[0];

        if (showtimeDate === today) {
          byDate[today].push(showtime);
        } else if (showtimeDate === tomorrowStr) {
          byDate[tomorrowStr].push(showtime);
        }
      });

      setShowtimesByDate(byDate);

      // Set showtimes based on selected date
      setShowtimes(
        selectedDate === "today" ? byDate[today] : byDate[tomorrowStr]
      );
    } catch (error) {
      console.error("Error fetching showtimes:", error);
      setShowtimes([]);
    }
  };

  // Load movies that have showtimes at a specific theater
  const loadMoviesForTheater = async (theaterId: number) => {
    try {
      // Get showtimes for this theater
      const theaterShowtimes = await movieService.getShowtimesByTheater(
        theaterId
      );

      // Get unique movie IDs from these showtimes
      const movieIds = [...new Set(theaterShowtimes.map((s) => s.movieId))];

      // Get all movies
      const allMovies = await movieService.getMovies();

      // Filter movies that have showtimes at this theater
      const filteredMovies = allMovies.filter((movie) =>
        movieIds.includes(movie.id)
      );

      setMovies(filteredMovies);
    } catch (error) {
      console.error("Failed to load movies for theater:", error);
      setMovies([]);
    }
  };

  // Handler functions
  const handleRefresh = async () => {
    setRefreshing(true);
    if (selectedTheater) {
      await loadMoviesForTheater(selectedTheater.id);
      await loadShowtimesForTheater(selectedTheater.id);
    } else {
      await loadData();
    }
    setRefreshing(false);
  };

  const handleSelectMovie = (movieId: number) => {
    router.push(`/movie/${movieId}`);
  };

  const handleSelectShowtime = (showtimeId: number) => {
    router.push(`/booking/${showtimeId}/seats`);
  };

  const handleLoginPress = () => {
    router.push("/login");
  };

  // Loading state
  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B4D335" />
        <ThemedText style={styles.loadingText}>Loading showtimes...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Lion's Den Cinemas",
          headerStyle: {
            backgroundColor: isDark ? "#1E2429" : "#FFFFFF",
          },
          headerTitleStyle: {
            color: isDark ? "#FFFFFF" : "#242424",
            fontSize: 18,
          },
          headerRight: () => (
            <View style={{ flexDirection: "row" }}>
              {!isAuthenticated ? (
                <TouchableOpacity
                  onPress={handleLoginPress}
                  style={{ marginRight: 15 }}
                >
                  <Ionicons name="person-outline" size={24} color="#B4D335" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => router.push("/profile")}
                  style={{ marginRight: 15 }}
                >
                  <Ionicons name="person" size={24} color="#B4D335" />
                </TouchableOpacity>
              )}
            </View>
          ),
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#B4D335"]}
            tintColor="#B4D335"
          />
        }
      >
        {/* Theater Selector */}
        <View style={styles.theaterSelectorContainer}>
          <TouchableOpacity
            style={styles.theaterDropdown}
            onPress={() => setShowTheaterDropdown(!showTheaterDropdown)}
          >
            <ThemedText style={styles.theaterName}>
              {selectedTheater ? selectedTheater.name : "Select Theater"}
            </ThemedText>
            <Ionicons
              name={showTheaterDropdown ? "chevron-up" : "chevron-down"}
              size={20}
              color="#B4D335"
            />
          </TouchableOpacity>

          {showTheaterDropdown && (
            <View style={styles.dropdown}>
              <ScrollView style={{ maxHeight: 200 }}>
                {theaters.map((theater) => (
                  <TouchableOpacity
                    key={theater.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedTheater(theater);
                      setShowTheaterDropdown(false);
                    }}
                  >
                    <ThemedText
                      style={[
                        styles.dropdownText,
                        selectedTheater?.id === theater.id &&
                          styles.selectedDropdownText,
                      ]}
                    >
                      {theater.name}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <ThemedText style={styles.welcomeText}>
          Welcome to Lion's Den Cinema
        </ThemedText>

        {movies.length > 0 ? (
          <MovieCarousel movies={movies} onSelectMovie={handleSelectMovie} />
        ) : (
          <View style={styles.noMoviesContainer}>
            <ThemedText style={styles.noMoviesText}>
              No movies available at this theater
            </ThemedText>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              isAuthenticated ? router.push("/tickets") : router.push("/login")
            }
          >
            <Ionicons name="ticket-outline" size={24} color="#B4D335" />
            <ThemedText style={styles.actionButtonText}>My Tickets</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/concessions")}
          >
            <Ionicons name="fast-food-outline" size={24} color="#B4D335" />
            <ThemedText style={styles.actionButtonText}>Order Food</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Date selector tabs */}
        <View style={styles.dateTabs}>
          <TouchableOpacity
            style={[
              styles.dateTab,
              selectedDate === "today" && styles.activeDateTab,
            ]}
            onPress={() => setSelectedDate("today")}
          >
            <ThemedText
              style={[
                styles.dateTabText,
                selectedDate === "today" && styles.activeDateTabText,
              ]}
            >
              Today
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.dateTab,
              selectedDate === "tomorrow" && styles.activeDateTab,
            ]}
            onPress={() => setSelectedDate("tomorrow")}
          >
            <ThemedText
              style={[
                styles.dateTabText,
                selectedDate === "tomorrow" && styles.activeDateTabText,
              ]}
            >
              Tomorrow
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Today's/Tomorrow's Showtimes */}
        <ThemedText style={styles.sectionTitle}>
          {selectedDate === "today"
            ? "Today's Showtimes"
            : "Tomorrow's Showtimes"}
        </ThemedText>

        {showtimes.length > 0 ? (
          <View style={styles.showtimesContainer}>
            {/* Group showtimes by movie */}
            {Object.entries(
              showtimes.reduce((acc, showtime) => {
                if (!acc[showtime.movieId]) {
                  acc[showtime.movieId] = {
                    movie: {
                      id: showtime.movieId,
                      title: showtime.movieTitle,
                      theaterName: showtime.theaterName,
                      screenName: showtime.screenName,
                    },
                    times: [],
                  };
                }
                acc[showtime.movieId].times.push({
                  id: showtime.id,
                  time: new Date(showtime.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                });
                return acc;
              }, {} as Record<number, { movie: { id: number; title: string; theaterName: string; screenName: string }; times: { id: number; time: string }[] }>)
            ).map(([movieId, data]) => (
              <View key={movieId} style={styles.movieShowtimesCard}>
                <ThemedText style={styles.movieShowtimeTitle}>
                  {data.movie.title}
                </ThemedText>
                <ThemedText style={styles.screenInfo}>
                  {data.movie.theaterName} • {data.movie.screenName}
                </ThemedText>
                <View style={styles.timesContainer}>
                  {data.times.map((time: any) => (
                    <TouchableOpacity
                      key={time.id}
                      style={styles.timeButton}
                      onPress={() => handleSelectShowtime(time.id)}
                    >
                      <ThemedText style={styles.timeText}>
                        {time.time}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.noShowtimesContainer}>
            <ThemedText style={styles.noShowtimesText}>
              No showtimes available for{" "}
              {selectedDate === "today" ? "today" : "tomorrow"}
            </ThemedText>
          </View>
        )}
      </ScrollView>

      {/* Theme toggle */}
      <ThemeToggle position="bottomRight" size={40} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  theaterSelectorContainer: {
    marginBottom: 20,
    position: "relative",
    zIndex: 10,
  },
  theaterDropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#262D33",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#B4D335",
  },
  theaterName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#262D33",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    marginTop: 5,
    zIndex: 100,
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  dropdownText: {
    fontSize: 16,
  },
  selectedDropdownText: {
    color: "#B4D335",
    fontWeight: "bold",
  },
  noMoviesContainer: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#262D33",
    borderRadius: 8,
    marginBottom: 20,
  },
  noMoviesText: {
    fontSize: 16,
    color: "#9BA1A6",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#9BA1A6",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#1E2429",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#B4D335",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonText: {
    color: "#B4D335",
    fontWeight: "bold",
    marginLeft: 8,
  },
  dateTabs: {
    flexDirection: "row",
    marginBottom: 15,
    marginTop: 10,
  },
  dateTab: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginRight: 8,
    borderRadius: 24,
    backgroundColor: "#262D33",
  },
  activeDateTab: {
    backgroundColor: "#B4D335",
  },
  dateTabText: {
    color: "white",
    fontSize: 16,
  },
  activeDateTabText: {
    color: "#242424",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  showtimesContainer: {
    marginBottom: 30,
  },
  movieShowtimesCard: {
    backgroundColor: "#262D33",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  movieShowtimeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  screenInfo: {
    fontSize: 14,
    color: "#9BA1A6",
    marginBottom: 12,
  },
  timesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  timeButton: {
    backgroundColor: "#0A7EA4",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  timeText: {
    color: "white",
    fontWeight: "500",
  },
  noShowtimesContainer: {
    padding: 30,
    backgroundColor: "#262D33",
    borderRadius: 12,
    alignItems: "center",
  },
  noShowtimesText: {
    color: "#9BA1A6",
    fontSize: 16,
  },
});
