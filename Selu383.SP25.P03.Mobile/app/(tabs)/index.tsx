import React, { useEffect, useState } from "react";
import {
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../components/AuthProvider";

import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { MovieCarousel } from "../../components/MovieCarousel";

import * as movieService from "../../services/movies/movieService";
import * as theaterService from "../../services/theaters/theaterService";

import { Movie, Showtime } from "../../types/models/movie";
import { Theater } from "../../types/models/theater";
import { homeScreenStyles as styles } from "../../styles/screens/homeScreen";

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  // State variables
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isTheaterDropdownVisible, setIsTheaterDropdownVisible] =
    useState(false);
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

  // Check authentication
  useEffect(() => {
    if (!user) {
      router.replace("./role-selection");
    }
  }, [user]);

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

  // Handle date tab selection
  const handleDateChange = (date: "today" | "tomorrow") => {
    setSelectedDate(date);

    // Update showtimes based on selected date
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    if (date === "today") {
      setShowtimes(showtimesByDate[today] || []);
    } else {
      setShowtimes(showtimesByDate[tomorrowStr] || []);
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
    router.push(`/showtime/${showtimeId}`);
  };

  const handleSelectTheater = (theater: Theater) => {
    setSelectedTheater(theater);
    setIsTheaterDropdownVisible(false);
  };

  const navigateToTickets = () => {
    router.push("./tickets");
  };

  const navigateToConcessions = () => {
    router.push("./concessions");
  };

  // Group showtimes by movie
  const groupedByMovie: Record<string, Showtime[]> = {};

  if (showtimes && showtimes.length > 0) {
    showtimes.forEach((showtime) => {
      const movieIdStr = String(showtime.movieId);
      if (!groupedByMovie[movieIdStr]) {
        groupedByMovie[movieIdStr] = [];
      }
      groupedByMovie[movieIdStr].push(showtime);
    });
  }

  // Loading state
  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B4D335" />
        <ThemedText style={styles.loadingText}>Loading...</ThemedText>
      </ThemedView>
    );
  }

  // If not logged in, show loading until redirect happens
  if (!user) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B4D335" />
      </ThemedView>
    );
  }

  // Role-based UI rendering
  if (user.role === "customer") {
    return (
      <>
        <Stack.Screen
          options={{
            title: selectedTheater ? selectedTheater.name : "Select Theater",
            headerStyle: {
              backgroundColor: "#1E2429",
            },
            headerTitleStyle: {
              color: "#FFFFFF",
              fontSize: 18,
            },
            headerRight: () => (
              <TouchableOpacity
                onPress={() =>
                  setIsTheaterDropdownVisible(!isTheaterDropdownVisible)
                }
                style={{ marginRight: 16 }}
              >
                <Ionicons name="chevron-down" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            ),
          }}
        />

        {isTheaterDropdownVisible && (
          <View style={[styles.dropdown, { backgroundColor: "#2A2A2A" }]}>
            {theaters.map((theater) => (
              <TouchableOpacity
                key={theater.id}
                style={styles.dropdownItem}
                onPress={() => handleSelectTheater(theater)}
              >
                <ThemedText style={[styles.dropdownText, { color: "#FFFFFF" }]}>
                  {theater.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <ThemedView style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
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
                style={[styles.actionButton, { backgroundColor: "#1E2429" }]}
                onPress={navigateToTickets}
              >
                <Ionicons name="ticket-outline" size={24} color="#B4D335" />
                <ThemedText
                  style={[styles.actionButtonText, { color: "#B4D335" }]}
                >
                  My Tickets
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#1E2429" }]}
                onPress={navigateToConcessions}
              >
                <Ionicons name="fast-food-outline" size={24} color="#B4D335" />
                <ThemedText
                  style={[styles.actionButtonText, { color: "#B4D335" }]}
                >
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
                onPress={() => handleDateChange("today")}
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
                onPress={() => handleDateChange("tomorrow")}
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

            {/* Showtimes section */}
            <ThemedText style={styles.sectionTitle}>
              {selectedDate === "today"
                ? "Today's Showtimes"
                : "Tomorrow's Showtimes"}
            </ThemedText>

            {Object.keys(groupedByMovie).length > 0 ? (
              Object.keys(groupedByMovie).map((movieIdStr) => {
                const movieShowtimes = groupedByMovie[movieIdStr];
                if (movieShowtimes.length === 0) return null;

                const movieData = movieShowtimes[0];

                return (
                  <View key={movieIdStr} style={styles.movieShowtimesContainer}>
                    <ThemedText style={styles.movieTitle}>
                      {movieData.movieTitle}
                    </ThemedText>
                    <ThemedText style={styles.screenInfo}>
                      {movieData.theaterName} • {movieData.screenName}
                    </ThemedText>

                    <View style={styles.showtimesGrid}>
                      {movieShowtimes.map((showtime) => {
                        // Format the time
                        const date = new Date(showtime.startTime);
                        const timeString = date.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        });

                        return (
                          <TouchableOpacity
                            key={showtime.id}
                            style={styles.showtimeBox}
                            onPress={() => handleSelectShowtime(showtime.id)}
                          >
                            <ThemedText style={styles.showtimeText}>
                              {timeString}
                            </ThemedText>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyStateContainer}>
                <Ionicons name="calendar-outline" size={50} color="#666" />
                <ThemedText style={styles.emptyStateText}>
                  No showtimes available for{" "}
                  {selectedDate === "today" ? "today" : "tomorrow"}
                </ThemedText>
              </View>
            )}
          </ScrollView>
        </ThemedView>
      </>
    );
  } else if (user.role === "staff") {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.staffHeader}>
          <ThemedText style={styles.staffTitle}>Staff Dashboard</ThemedText>
          <ThemedText style={styles.staffSubtitle}>
            Welcome back, {user.username}
          </ThemedText>
        </View>

        <ScrollView contentContainerStyle={styles.staffContent}>
          <View style={styles.statCard}>
            <Ionicons name="fast-food-outline" size={32} color="#B4D335" />
            <View style={styles.statInfo}>
              <ThemedText style={styles.statValue}>12</ThemedText>
              <ThemedText style={styles.statLabel}>Pending Orders</ThemedText>
            </View>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("./orders")}
            >
              <ThemedText style={styles.actionButtonText}>View</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="people-outline" size={32} color="#B4D335" />
            <View style={styles.statInfo}>
              <ThemedText style={styles.statValue}>143</ThemedText>
              <ThemedText style={styles.statLabel}>
                Today's Attendance
              </ThemedText>
            </View>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push("./attendance")}
            >
              <ThemedText style={styles.actionButtonText}>View</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.quickActionsContainer}>
            <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>

            <View style={styles.quickActions}>
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => router.push("./scan")}
              >
                <Ionicons name="qr-code" size={28} color="#0A7EA4" />
                <ThemedText style={styles.quickActionText}>
                  Scan Tickets
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => router.push("./delivery")}
              >
                <Ionicons name="navigate" size={28} color="#0A7EA4" />
                <ThemedText style={styles.quickActionText}>
                  Deliver Orders
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={() => router.push("./validate")}
              >
                <Ionicons name="checkmark-circle" size={28} color="#0A7EA4" />
                <ThemedText style={styles.quickActionText}>
                  Validate Tickets
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    );
  } else if (user.role === "manager") {
    // Manager home screen
    return (
      <ThemedView style={styles.container}>
        <View style={styles.managerHeader}>
          <ThemedText style={styles.managerTitle}>Manager Dashboard</ThemedText>
          <ThemedText style={styles.managerSubtitle}>
            Welcome back, {user.username}
          </ThemedText>
        </View>

        <ScrollView contentContainerStyle={styles.managerContent}>
          <View style={styles.overviewRow}>
            <View style={[styles.overviewCard, styles.salesCard]}>
              <ThemedText style={styles.overviewValue}>$12,458</ThemedText>
              <ThemedText style={styles.overviewLabel}>
                Today's Sales
              </ThemedText>
              <View style={styles.trendContainer}>
                <Ionicons name="arrow-up" size={14} color="#4CD964" />
                <ThemedText style={styles.trendPositive}>+12%</ThemedText>
              </View>
            </View>

            <View style={[styles.overviewCard, styles.attendanceCard]}>
              <ThemedText style={styles.overviewValue}>354</ThemedText>
              <ThemedText style={styles.overviewLabel}>Tickets Sold</ThemedText>
              <View style={styles.trendContainer}>
                <Ionicons name="arrow-up" size={14} color="#4CD964" />
                <ThemedText style={styles.trendPositive}>+8%</ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.performanceContainer}>
            <View style={styles.sectionHeaderRow}>
              <ThemedText style={styles.sectionTitle}>
                Top Performing Movies
              </ThemedText>
              <TouchableOpacity onPress={() => router.push("./dashboard")}>
                <ThemedText style={styles.viewAllText}>View All</ThemedText>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.performanceList}
            >
              {movies.slice(0, 5).map((movie, index) => (
                <View key={movie.id} style={styles.performanceCard}>
                  <ThemedText style={styles.movieTitle}>
                    {movie.title}
                  </ThemedText>
                  <ThemedText style={styles.movieMetric}>
                    {80 - index * 12}% capacity
                  </ThemedText>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.actionsContainer}>
            <ThemedText style={styles.sectionTitle}>
              Management Actions
            </ThemedText>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("./schedule")}
            >
              <Ionicons name="calendar" size={24} color="#C87000" />
              <View style={styles.actionTextContainer}>
                <ThemedText style={styles.actionTitle}>
                  Schedule Management
                </ThemedText>
                <ThemedText style={styles.actionDescription}>
                  Manage movie showtimes and staff assignments
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666666" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("./inventory")}
            >
              <Ionicons name="fast-food" size={24} color="#C87000" />
              <View style={styles.actionTextContainer}>
                <ThemedText style={styles.actionTitle}>
                  Concession Inventory
                </ThemedText>
                <ThemedText style={styles.actionDescription}>
                  Manage food items and inventory levels
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666666" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("./management")}
            >
              <Ionicons name="people" size={24} color="#C87000" />
              <View style={styles.actionTextContainer}>
                <ThemedText style={styles.actionTitle}>
                  Staff Management
                </ThemedText>
                <ThemedText style={styles.actionDescription}>
                  Manage staff accounts and permissions
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#666666" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ThemedView>
    );
  } else {
    // Default fallback screen
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.welcomeText}>
          Welcome to Lion's Den Cinema
        </ThemedText>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("./role-selection")}
        >
          <ThemedText style={styles.loginButtonText}>
            Log In / Sign Up
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }
}
