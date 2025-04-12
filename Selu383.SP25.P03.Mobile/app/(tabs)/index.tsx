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
import { ThemeAwareScreen } from "../../components/ThemeAwareScreen";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { MovieCarousel } from "../../components/MovieCarousel";
import { UIColors } from "../../styles/theme/colors";

import * as movieService from "../../services/movies/movieService";
import * as theaterService from "../../services/theaters/theaterService";

import { Movie, Showtime } from "../../types/models/movie";
import { Theater } from "../../types/models/theater";

export default function HomeScreen() {
  const { user } = useAuth();
  const { colorScheme } = useTheme();
  const router = useRouter();
  const isDark = colorScheme === "dark";

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
      <ThemeAwareScreen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={UIColors.brandGreen} />
          <ThemedText style={styles.loadingText}>Loading...</ThemedText>
        </View>
      </ThemeAwareScreen>
    );
  }

  // If not logged in, show loading until redirect happens
  if (!user) {
    return (
      <ThemeAwareScreen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={UIColors.brandGreen} />
        </View>
      </ThemeAwareScreen>
    );
  }

  // Customer view
  if (user.role === "customer") {
    return (
      <ThemeAwareScreen>
        <Stack.Screen
          options={{
            title: selectedTheater ? selectedTheater.name : "Select Theater",
            headerStyle: {
              backgroundColor: isDark
                ? UIColors.dark.navBar
                : UIColors.light.navBar,
            },
            headerTitleStyle: {
              color: isDark ? UIColors.dark.text : UIColors.light.text,
              fontSize: 18,
            },
            headerRight: () => (
              <TouchableOpacity
                onPress={() =>
                  setIsTheaterDropdownVisible(!isTheaterDropdownVisible)
                }
                style={{ marginRight: 16 }}
              >
                <Ionicons
                  name="chevron-down"
                  size={24}
                  color={isDark ? UIColors.dark.text : UIColors.light.text}
                />
              </TouchableOpacity>
            ),
          }}
        />

        {isTheaterDropdownVisible && (
          <View
            style={[
              styles.dropdown,
              {
                backgroundColor: isDark
                  ? UIColors.dark.card
                  : UIColors.light.card,
              },
            ]}
          >
            {theaters.map((theater) => (
              <TouchableOpacity
                key={theater.id}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedTheater(theater);
                  setIsTheaterDropdownVisible(false);
                }}
              >
                <ThemedText style={styles.dropdownText}>
                  {theater.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[UIColors.brandGreen]}
              tintColor={UIColors.brandGreen}
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
              style={[
                styles.actionButton,
                {
                  backgroundColor: isDark
                    ? UIColors.dark.surface
                    : UIColors.light.surface,
                },
              ]}
              onPress={navigateToTickets}
            >
              <Ionicons
                name="ticket-outline"
                size={24}
                color={UIColors.brandGreen}
              />
              <ThemedText style={styles.actionButtonText}>
                My Tickets
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: isDark
                    ? UIColors.dark.surface
                    : UIColors.light.surface,
                },
              ]}
              onPress={navigateToConcessions}
            >
              <Ionicons
                name="fast-food-outline"
                size={24}
                color={UIColors.brandGreen}
              />
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
                {
                  backgroundColor: isDark
                    ? UIColors.dark.card
                    : UIColors.light.card,
                },
                selectedDate === "today" && {
                  backgroundColor: UIColors.brandGreen,
                },
              ]}
              onPress={() => handleDateChange("today")}
            >
              <ThemedText
                style={[
                  styles.dateTabText,
                  selectedDate === "today" && {
                    color: "#242424",
                    fontWeight: "bold",
                  },
                ]}
              >
                Today
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.dateTab,
                {
                  backgroundColor: isDark
                    ? UIColors.dark.card
                    : UIColors.light.card,
                },
                selectedDate === "tomorrow" && {
                  backgroundColor: UIColors.brandGreen,
                },
              ]}
              onPress={() => handleDateChange("tomorrow")}
            >
              <ThemedText
                style={[
                  styles.dateTabText,
                  selectedDate === "tomorrow" && {
                    color: "#242424",
                    fontWeight: "bold",
                  },
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
                <View
                  key={movieIdStr}
                  style={[
                    styles.movieShowtimesContainer,
                    {
                      backgroundColor: isDark
                        ? UIColors.dark.surface
                        : UIColors.light.surface,
                    },
                  ]}
                >
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
                          style={[
                            styles.showtimeBox,
                            {
                              backgroundColor: isDark
                                ? UIColors.dark.card
                                : UIColors.light.card,
                            },
                          ]}
                          onPress={() => handleSelectShowtime(showtime.id)}
                        >
                          <ThemedText style={{ color: UIColors.brandGreen }}>
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
            <View
              style={[
                styles.emptyStateContainer,
                {
                  backgroundColor: isDark
                    ? UIColors.dark.card
                    : UIColors.light.card,
                },
              ]}
            >
              <Ionicons
                name="calendar-outline"
                size={50}
                color={isDark ? "#666" : "#999"}
              />
              <ThemedText style={styles.emptyStateText}>
                No showtimes available for{" "}
                {selectedDate === "today" ? "today" : "tomorrow"}
              </ThemedText>
            </View>
          )}
        </ScrollView>
      </ThemeAwareScreen>
    );
  } else if (user.role === "staff") {
    // Staff home screen
    return (
      <ThemeAwareScreen>
        <View style={[styles.staffHeader, { backgroundColor: "#0A7EA4" }]}>
          <ThemedText style={styles.staffTitle}>Staff Dashboard</ThemedText>
          <ThemedText style={styles.staffSubtitle}>
            Welcome back, {user.username}
          </ThemedText>
        </View>

        <ScrollView contentContainerStyle={styles.staffContent}>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: isDark
                  ? UIColors.dark.card
                  : UIColors.light.card,
              },
            ]}
          >
            <Ionicons
              name="fast-food-outline"
              size={32}
              color={UIColors.brandGreen}
            />
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

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: isDark
                  ? UIColors.dark.card
                  : UIColors.light.card,
              },
            ]}
          >
            <Ionicons
              name="people-outline"
              size={32}
              color={UIColors.brandGreen}
            />
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
                style={[
                  styles.quickActionCard,
                  {
                    backgroundColor: isDark
                      ? UIColors.dark.card
                      : UIColors.light.card,
                  },
                ]}
                onPress={() => router.push("./scan")}
              >
                <Ionicons name="qr-code" size={28} color="#0A7EA4" />
                <ThemedText style={styles.quickActionText}>
                  Scan Tickets
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.quickActionCard,
                  {
                    backgroundColor: isDark
                      ? UIColors.dark.card
                      : UIColors.light.card,
                  },
                ]}
                onPress={() => router.push("./delivery")}
              >
                <Ionicons name="navigate" size={28} color="#0A7EA4" />
                <ThemedText style={styles.quickActionText}>
                  Deliver Orders
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.quickActionCard,
                  {
                    backgroundColor: isDark
                      ? UIColors.dark.card
                      : UIColors.light.card,
                  },
                ]}
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
      </ThemeAwareScreen>
    );
  } else if (user.role === "manager") {
    // Manager home screen
    return (
      <ThemeAwareScreen>
        <View style={[styles.managerHeader, { backgroundColor: "#C87000" }]}>
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
                <View
                  key={movie.id}
                  style={[
                    styles.performanceCard,
                    {
                      backgroundColor: isDark
                        ? UIColors.dark.card
                        : UIColors.light.card,
                    },
                  ]}
                >
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
              style={[
                styles.actionCard,
                {
                  backgroundColor: isDark
                    ? UIColors.dark.card
                    : UIColors.light.card,
                },
              ]}
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
              style={[
                styles.actionCard,
                {
                  backgroundColor: isDark
                    ? UIColors.dark.card
                    : UIColors.light.card,
                },
              ]}
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
              style={[
                styles.actionCard,
                {
                  backgroundColor: isDark
                    ? UIColors.dark.card
                    : UIColors.light.card,
                },
              ]}
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
      </ThemeAwareScreen>
    );
  } else {
    // Default fallback screen
    return (
      <ThemeAwareScreen>
        <ThemedText style={styles.welcomeText}>
          Welcome to Lion's Den Cinema
        </ThemedText>
        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: UIColors.brandGreen }]}
          onPress={() => router.push("../role-selection")}
        >
          <ThemedText style={styles.loginButtonText}>
            Log In / Sign Up
          </ThemedText>
        </TouchableOpacity>
      </ThemeAwareScreen>
    );
  }
}

// Theme-aware styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
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
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  actionButton: {
    flex: 1,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  movieShowtimesContainer: {
    marginBottom: 20,
    borderRadius: 10,
    padding: 15,
    shadowColor: "#B4D335",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  screenInfo: {
    fontSize: 14,
    marginBottom: 12,
  },
  showtimesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  showtimeBox: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    minWidth: 80,
    alignItems: "center",
    shadowColor: "#B4D335",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  showtimeText: {
    fontWeight: "500",
  },
  loginButton: {
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
  // Staff styles
  staffHeader: {
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
  },
  statLabel: {
    fontSize: 14,
  },
  quickActionsContainer: {
    marginTop: 24,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickActionCard: {
    borderRadius: 12,
    padding: 16,
    width: "31%",
    alignItems: "center",
  },
  quickActionText: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 13,
  },
  // Manager styles
  managerHeader: {
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
    padding: 12,
    borderRadius: 8,
  },
  movieMetric: {
    fontSize: 12,
  },
  actionsContainer: {
    marginBottom: 30,
  },
  actionCard: {
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
  },
  actionDescription: {
    fontSize: 13,
    marginTop: 4,
  },
  chevron: {
    marginLeft: "auto",
  },
  dateTabs: {
    flexDirection: "row",
    marginBottom: 15,
    marginTop: 10,
  },
  dateTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
  },
  dateTabText: {
    fontSize: 14,
  },
  emptyStateContainer: {
    alignItems: "center",
    padding: 30,
    borderRadius: 12,
    marginTop: 10,
  },
  emptyStateText: {
    marginTop: 10,
    textAlign: "center",
  },
});
