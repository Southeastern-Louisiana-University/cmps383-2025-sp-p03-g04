import React, { useEffect, useState } from "react";
import {
  StyleSheet,
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

import type { Movie } from "../../components/MovieCarousel";
import type { Showtime } from "../../components/TodaysShowsList";
import type { Theater } from "../../components/TheaterSelector";

import * as moviesAPI from "../../services/movies";
import * as theatersAPI from "../../services/theaters";
import * as showtimesAPI from "../../services/showtimes";

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  // Properly typed state variables
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isTheaterDropdownVisible, setIsTheaterDropdownVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Check authentication
  useEffect(() => {
    if (!user) {
      router.replace("./role-selection");
    }
  }, [user]);

  // Filter showtimes based on selected theater
  useEffect(() => {
    if (selectedTheater) {
      showtimesAPI
        .getShowtimesByTheater(selectedTheater.id)
        .then((data) => setShowtimes(data));
    } else if (theaters.length > 0) {
      setSelectedTheater(theaters[0]);
      showtimesAPI
        .getShowtimesByTheater(theaters[0].id)
        .then((data) => setShowtimes(data));
    } else {
      showtimesAPI.getShowtimes().then((data) => setShowtimes(data));
    }
  }, [selectedTheater, theaters]);

  // Load data function
  const loadData = async () => {
    setIsLoading(true);
    try {
      // Fetch all necessary data
      const moviesData = await moviesAPI.getMovies();
      const theatersData = await theatersAPI.getTheaters();

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

  // Handler functions with proper typing
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

  // Group showtimes by movie with proper typing
  const groupedByMovie: Record<string, Showtime[]> = {};

  showtimes.forEach((showtime) => {
    const movieIdStr = String(showtime.movieId);
    if (!groupedByMovie[movieIdStr]) {
      groupedByMovie[movieIdStr] = [];
    }
    groupedByMovie[movieIdStr].push(showtime);
  });

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
            title: selectedTheater ? selectedTheater.name : "Theater",
            headerRight: () => (
              <TouchableOpacity
                onPress={() =>
                  setIsTheaterDropdownVisible(!isTheaterDropdownVisible)
                }
                style={{ marginRight: 16 }}
              >
                <Ionicons name="chevron-down" size={24} color="#242424" />
              </TouchableOpacity>
            ),
          }}
        />

        {isTheaterDropdownVisible && (
          <View style={styles.dropdown}>
            {theaters.map((theater) => (
              <TouchableOpacity
                key={theater.id}
                style={styles.dropdownItem}
                onPress={() => handleSelectTheater(theater)}
              >
                <ThemedText style={styles.dropdownText}>
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
                style={styles.actionButton}
                onPress={navigateToTickets}
              >
                <Ionicons name="ticket-outline" size={24} color="white" />
                <ThemedText style={styles.actionButtonText}>
                  My Tickets
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={navigateToConcessions}
              >
                <Ionicons name="fast-food-outline" size={24} color="white" />
                <ThemedText style={styles.actionButtonText}>
                  Order Food
                </ThemedText>
              </TouchableOpacity>
            </View>

            <ThemedText style={styles.sectionTitle}>
              Today's Showtimes
            </ThemedText>

            {/* Showtimes by Movie */}
            {Object.keys(groupedByMovie).map((movieIdStr) => {
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
            })}
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

// All required styles
const styles = StyleSheet.create({
  // Common styles
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
  dropdown: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    backgroundColor: "#65a30d",
    zIndex: 999,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  dropdownText: {
    fontSize: 16,
    color: "#242424",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#1E3A55",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
    flexDirection: "row",
    justifyContent: "center",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  movieShowtimesContainer: {
    marginBottom: 20,
    backgroundColor: "#1E2429",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  screenInfo: {
    fontSize: 14,
    color: "#9BA1A6",
    marginBottom: 12,
  },
  showtimesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  showtimeBox: {
    backgroundColor: "#0a7ea4",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    minWidth: 80,
    alignItems: "center",
  },
  showtimeText: {
    color: "white",
    fontWeight: "500",
  },

  // Additional styles for staff and manager
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#9BA1A6",
  },
  loginButton: {
    backgroundColor: "#B4D335",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    margin: 20,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#242424",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Staff header styles
  staffHeader: {
    backgroundColor: "#0A7EA4",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  staffTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  staffSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  staffContent: {
    padding: 16,
  },
  statCard: {
    backgroundColor: "#262D33",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  statInfo: {
    flex: 1,
    marginLeft: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  statLabel: {
    fontSize: 14,
    color: "#9BA1A6",
  },
  quickActionsContainer: {
    marginTop: 24,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickActionCard: {
    backgroundColor: "#262D33",
    borderRadius: 12,
    padding: 16,
    width: "31%",
    alignItems: "center",
  },
  quickActionText: {
    color: "white",
    marginTop: 8,
    textAlign: "center",
    fontSize: 13,
  },

  // Manager dashboard styles
  managerHeader: {
    backgroundColor: "#C87000",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  managerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  managerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  managerContent: {
    padding: 16,
  },
  overviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  overviewCard: {
    width: "48%",
    padding: 16,
    borderRadius: 12,
  },
  salesCard: {
    backgroundColor: "#1E3A55",
  },
  attendanceCard: {
    backgroundColor: "#2D4263",
  },
  overviewValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  overviewLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 4,
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  trendPositive: {
    color: "#4CD964",
    fontSize: 14,
    marginLeft: 4,
  },
  performanceContainer: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAllText: {
    color: "#C87000",
    fontSize: 14,
  },
  performanceList: {
    paddingRight: 20,
  },
  performanceCard: {
    width: 120,
    marginRight: 12,
    backgroundColor: "#262D33",
    padding: 12,
    borderRadius: 8,
  },
  movieMetric: {
    fontSize: 12,
    color: "#9BA1A6",
  },
  actionsContainer: {
    marginBottom: 30,
  },
  actionCard: {
    backgroundColor: "#262D33",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  actionTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  actionDescription: {
    fontSize: 13,
    color: "#9BA1A6",
    marginTop: 4,
  },
});
