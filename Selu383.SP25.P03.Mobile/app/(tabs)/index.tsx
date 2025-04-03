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
      movieService
        .getShowtimesByTheater(selectedTheater.id)
        .then((data: Showtime[]) => setShowtimes(data));
    } else if (theaters.length > 0) {
      setSelectedTheater(theaters[0]);
      movieService
        .getShowtimesByTheater(theaters[0].id)
        .then((data: Showtime[]) => setShowtimes(data));
    } else {
      movieService.getShowtimes().then((data: Showtime[]) => setShowtimes(data));
    }
  }, [selectedTheater, theaters]);

  // Load data function
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