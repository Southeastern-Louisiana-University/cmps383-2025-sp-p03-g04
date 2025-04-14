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
import { TheaterSelector } from "../../components/TheaterSelector";
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
  const [showtimesByDate, setShowtimesByDate] = useState<
    Record<string, Showtime[]>
  >({});

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Load theater showtimes when selected theater changes
  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        let theaterId = selectedTheater?.id;
        if (!theaterId && theaters.length > 0) {
          // If no theater is selected but we have theaters, use the first one
          theaterId = theaters[0].id;
          setSelectedTheater(theaters[0]);
        }

        if (theaterId) {
          // Fetch showtimes for this theater
          const allShowtimes = await movieService.getShowtimesByTheater(
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
          allShowtimes.forEach((showtime) => {
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
        }
      } catch (error) {
        console.error("Error fetching showtimes:", error);
      }
    };

    fetchShowtimes();
  }, [selectedTheater, theaters, selectedDate]);

  // Load all data
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Fetch all necessary data
      const moviesData = await movieService.getMovies();
      const theatersData = await theaterService.getTheaters();

      setMovies(moviesData);
      setTheaters(theatersData);

      if (theatersData.length > 0 && !selectedTheater) {
        setSelectedTheater(theatersData[0]);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
      setMovies([]);
      setTheaters([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handler functions
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSelectMovie = (movieId: number) => {
    router.push(`/movie/${movieId}`);
  };

  const handleSelectShowtime = (showtimeId: number) => {
    router.push(`/booking/${showtimeId}/seats`);
  };

  const handleSelectTheater = (theater: Theater) => {
    setSelectedTheater(theater);
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
          title: selectedTheater ? selectedTheater.name : "Lion's Den Cinemas",
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
        <ThemedText style={styles.welcomeText}>
          Welcome to Lion's Den Cinema
        </ThemedText>

        <MovieCarousel movies={movies} onSelectMovie={handleSelectMovie} />

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

        <TodaysShowsList
          showtimes={showtimes}
          onSelectShowtime={handleSelectShowtime}
        />
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
});
