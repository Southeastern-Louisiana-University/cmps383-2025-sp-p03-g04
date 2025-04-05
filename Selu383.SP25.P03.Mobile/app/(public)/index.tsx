import React, { useEffect, useState } from "react";
import {
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
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

import * as movieService from "../../services/movies/movieService";
import * as theaterService from "../../services/theaters/theaterService";

import { Movie, Showtime } from "../../types/models/movie";
import { Theater } from "../../types/models/theater";
import { homeScreenStyles as styles } from "../../styles/screens/homeScreen";

export default function HomeScreen() {
  const { user, isAuthenticated } = useAuth();
  const { isDarkMode, isTheaterMode } = useTheme();
  const router = useRouter();

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
    // Navigate to booking flow - no authentication required
    router.push({
      pathname: "/booking/[id]/seats",
      params: { id: showtimeId.toString() },
    });
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
    <>
      <Stack.Screen
        options={{
          title: selectedTheater ? selectedTheater.name : "Lion's Den Cinemas",
          headerStyle: {
            backgroundColor: "#1E2429",
          },
          headerTitleStyle: {
            color: "#FFFFFF",
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

      <ThemedView style={styles.container}>
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
          <View style={styles.logoContainer}>
            <Ionicons
              name="film-outline"
              size={80}
              color="#B4D335"
              style={{ marginBottom: 16 }}
            />
            <ThemedText style={styles.title}>Lion's Den Cinemas</ThemedText>
            <ThemedText style={styles.subtitle}>
              {isAuthenticated ? "Welcome back" : "Create your account"}
            </ThemedText>
          </View>

          <TheaterSelector
            theaters={theaters}
            selectedTheater={selectedTheater}
            onSelectTheater={handleSelectTheater}
          />

          <MovieCarousel movies={movies} onSelectMovie={handleSelectMovie} />

          {/* Quick Actions */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/movies")}
            >
              <Ionicons name="film-outline" size={24} color="#B4D335" />
              <ThemedText style={styles.actionButtonText}>
                All Movies
              </ThemedText>
            </TouchableOpacity>

            {isAuthenticated ? (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push("/tickets")}
              >
                <Ionicons name="ticket-outline" size={24} color="#B4D335" />
                <ThemedText style={styles.actionButtonText}>
                  My Tickets
                </ThemedText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push("/login")}
              >
                <Ionicons name="log-in-outline" size={24} color="#B4D335" />
                <ThemedText style={styles.actionButtonText}>Sign In</ThemedText>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("/concessions")}
            >
              <Ionicons name="fast-food-outline" size={24} color="#B4D335" />
              <ThemedText style={styles.actionButtonText}>
                Order Food
              </ThemedText>
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
          <TodaysShowsList
            showtimes={showtimes}
            onSelectShowtime={handleSelectShowtime}
          />
        </ScrollView>
      </ThemedView>
    </>
  );
}
