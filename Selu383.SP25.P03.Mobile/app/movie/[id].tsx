import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Import themed components
import { ThemeAwareScreen } from "../../components/ThemeAwareScreen";
import { ThemedText } from "../../components/ThemedText";
import { ThemedCard } from "../../components/ui/ThemedCard";
import { ThemedButton } from "../../components/ui/ThemedButton";
import { useTheme } from "../../components/ThemeProvider";
import { UIColors } from "../../styles/theme/colors";
import { useThemedStyles } from "../../hooks/useThemedStyles";

// Import services and types
import {
  getMovie,
  getShowtimesByMovie,
} from "../../services/movies/movieService";
import { getMovieDetails } from "../../services/movies/tmdbService";
import { Movie, Showtime } from "../../types/models/movie";
import { ShowtimesByTheater } from "../../types/models/movie";

// Create themed styles
import { movieDetailsStyles as baseStyles } from "../../styles/screens/movieDetails";

// Interface for showtimes grouped by date
interface ShowtimesByDate {
  date: string;
  dateLabel: string;
  theaters: ShowtimesByTheater[];
}

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  // Create theme-aware styles
  const styles = useThemedStyles((isDark, colors) => ({
    container: {
      flex: 1,
      backgroundColor: isDark
        ? colors.dark.background
        : colors.light.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isDark
        ? colors.dark.background
        : colors.light.background,
    },
    loadingText: {
      color: isDark ? colors.dark.text : colors.light.text,
      marginTop: 8,
    },
    movieHeader: {
      flexDirection: "row",
      padding: 16,
      backgroundColor: isDark ? colors.dark.surface : colors.light.surface,
    },
    poster: {
      width: 150,
      height: 225,
      borderRadius: 8,
    },
    detailsContainer: {
      flex: 1,
      marginLeft: 16,
      justifyContent: "flex-start",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: isDark ? colors.dark.text : colors.light.text,
      marginBottom: 16,
    },
    detailRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    detailLabel: {
      width: 80,
      fontSize: 16,
      color: isDark ? colors.dark.text : colors.light.text,
      fontWeight: "500",
    },
    detailValue: {
      fontSize: 16,
      color: isDark ? colors.dark.text : colors.light.text,
    },
    ratingBadge: {
      backgroundColor: isDark ? "#1e293b" : "#e2e8f0",
      paddingVertical: 2,
      paddingHorizontal: 8,
      borderRadius: 4,
    },
    ratingText: {
      color: isDark ? colors.dark.text : colors.light.text,
      fontSize: 14,
      fontWeight: "500",
    },
    sectionContainer: {
      padding: 16,
      backgroundColor: isDark ? colors.dark.card : colors.light.card,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDark ? colors.dark.text : colors.light.text,
      marginBottom: 8,
    },
    synopsis: {
      fontSize: 16,
      color: isDark ? colors.dark.text : colors.light.text,
      lineHeight: 24,
    },
    dateTabsContainer: {
      flexDirection: "row",
      marginBottom: 15,
      paddingHorizontal: 5,
    },
    dateTab: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      marginRight: 8,
      borderRadius: 20,
      backgroundColor: isDark ? colors.dark.card : colors.light.card,
    },
    selectedDateTab: {
      backgroundColor: colors.brandGreen,
    },
    dateTabText: {
      color: isDark ? colors.dark.text : colors.light.text,
      fontSize: 14,
    },
    selectedDateTabText: {
      color: "#242424", // Keep text dark on green background
      fontWeight: "bold",
    },
    theaterShowtimes: {
      marginBottom: 20,
    },
    theaterHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    },
    theaterName: {
      fontSize: 16,
      fontWeight: "600",
      color: isDark ? colors.dark.text : colors.light.text,
    },
    distance: {
      fontSize: 14,
      color: isDark ? colors.dark.textSecondary : colors.light.textSecondary,
    },
    showtimesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      padding: 16,
    },
    showtimeItem: {
      width: 70,
      borderWidth: 1,
      borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
      borderRadius: 4,
      marginRight: 12,
      marginBottom: 12,
      padding: 8,
      alignItems: "center",
    },
    showtimeTime: {
      fontSize: 16,
      fontWeight: "500",
      color: isDark ? colors.dark.text : colors.light.text,
    },
    showtimePeriod: {
      fontSize: 12,
      color: isDark ? colors.dark.textSecondary : colors.light.textSecondary,
    },
    noShowtimesContainer: {
      alignItems: "center",
      padding: 30,
      backgroundColor: isDark ? colors.dark.card : colors.light.card,
      borderRadius: 12,
      marginTop: 10,
    },
    noShowtimesText: {
      color: isDark ? colors.dark.textSecondary : colors.light.textSecondary,
      marginTop: 10,
      textAlign: "center",
    },
  }));

  // State variables
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimesByDate, setShowtimesByDate] = useState<ShowtimesByDate[]>([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [trailerLoading, setTrailerLoading] = useState(false);

  // Load movie data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch movie details
        const movieData = await getMovie(Number(id));
        setMovie(movieData);

        // Fetch showtimes for this movie
        const showtimesData = await getShowtimesByMovie(Number(id));

        // Group by date and theater
        const grouped: Record<string, Record<number, ShowtimesByTheater>> = {};

        showtimesData.forEach((showtime) => {
          const dateStr = new Date(showtime.startTime)
            .toISOString()
            .split("T")[0];
          if (!grouped[dateStr]) {
            grouped[dateStr] = {};
          }

          if (!grouped[dateStr][showtime.theaterId]) {
            grouped[dateStr][showtime.theaterId] = {
              theaterId: showtime.theaterId,
              theaterName: showtime.theaterName,
              distance: "2.5 miles", // Example
              showtimes: [],
            };
          }

          grouped[dateStr][showtime.theaterId].showtimes.push({
            id: showtime.id,
            startTime: showtime.startTime,
          });
        });

        // Convert to array structure
        const dates = Object.keys(grouped).sort();
        const showtimesByDateArray = dates.map((date) => ({
          date,
          // Format the date for display (e.g., "Today", "Tomorrow", or "Wed, Apr 5")
          dateLabel: getDateLabel(date),
          theaters: Object.values(grouped[date]),
        }));

        setShowtimesByDate(showtimesByDateArray);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Helper function to format date labels
  const getDateLabel = (dateStr: string) => {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    if (dateStr === today) return "Today";
    if (dateStr === tomorrowStr) return "Tomorrow";

    // Format as "Mon, Apr 5"
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Handler for watching trailer
  const handleWatchTrailer = async () => {
    if (!movie?.trailerUrl) {
      // If we don't have a trailer URL, attempt to find one using the movie title
      setTrailerLoading(true);
      try {
        // Fallback: search for a trailer on YouTube
        const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
          movie?.title || ""
        )}+trailer`;
        await Linking.openURL(youtubeUrl);
      } catch (error) {
        console.error("Failed to open trailer:", error);
      } finally {
        setTrailerLoading(false);
      }
    } else {
      // Open the trailer URL if available
      await Linking.openURL(movie.trailerUrl);
    }
  };

  // Handler for booking tickets
  const handleBookTickets = (showtimeId: number) => {
    router.push(`./book/${showtimeId}/seats`);
  };

  // Helper function to format time
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;

    return {
      time: `${hours}:${minutes.toString().padStart(2, "0")}`,
      period: ampm,
    };
  };

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <ThemeAwareScreen>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={UIColors.brandGreen} />
          <ThemedText style={styles.loadingText}>
            Loading movie details...
          </ThemedText>
        </View>
      </ThemeAwareScreen>
    );
  }

  // Show error state if movie not found
  if (!movie) {
    return (
      <ThemeAwareScreen>
        <View style={styles.loadingContainer}>
          <ThemedText>Movie not found</ThemedText>
        </View>
      </ThemeAwareScreen>
    );
  }

  // Main render
  return (
    <ThemeAwareScreen>
      <Stack.Screen
        options={{
          title: "Movie Details",
          headerStyle: {
            backgroundColor: isDark
              ? UIColors.dark.navBar
              : UIColors.light.navBar,
          },
          headerTitleStyle: {
            color: isDark ? UIColors.dark.text : UIColors.light.text,
          },
          headerTintColor: isDark ? UIColors.dark.text : UIColors.light.text,
        }}
      />

      <ScrollView style={styles.container}>
        <View style={styles.movieHeader}>
          <Image
            source={{ uri: movie.posterUrl }}
            style={styles.poster}
            resizeMode="cover"
          />
          <View style={styles.detailsContainer}>
            <ThemedText style={styles.title}>{movie.title}</ThemedText>

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Rating</ThemedText>
              <View style={styles.ratingBadge}>
                <ThemedText style={styles.ratingText}>
                  {movie.rating}
                </ThemedText>
              </View>
            </View>

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Duration</ThemedText>
              <ThemedText style={styles.detailValue}>
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </ThemedText>
            </View>

            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Genre</ThemedText>
              <ThemedText style={styles.detailValue}>
                {movie.genre || "N/A"}
              </ThemedText>
            </View>

            <ThemedButton
              variant="primary"
              size="small"
              isLoading={trailerLoading}
              onPress={handleWatchTrailer}
              style={{ marginTop: 16, alignSelf: "flex-start" }}
              leftIcon={<Ionicons name="play" size={16} color="#242424" />}
            >
              Trailer
            </ThemedButton>
          </View>
        </View>

        <ThemedCard
          style={styles.sectionContainer}
          variant="filled"
          padding="medium"
          elevation="none"
        >
          <ThemedText style={styles.sectionTitle}>Synopsis</ThemedText>
          <ThemedText style={styles.synopsis}>{movie.description}</ThemedText>
        </ThemedCard>

        <ThemedCard
          style={{ marginHorizontal: 16, marginBottom: 16 }}
          variant="filled"
          padding="medium"
          elevation="low"
        >
          <ThemedText style={styles.sectionTitle}>Showtimes</ThemedText>

          {/* Date selector tabs */}
          {showtimesByDate.length > 0 && (
            <View style={styles.dateTabsContainer}>
              {showtimesByDate.map((dateGroup, index) => (
                <TouchableOpacity
                  key={dateGroup.date}
                  style={[
                    styles.dateTab,
                    selectedDateIndex === index && styles.selectedDateTab,
                  ]}
                  onPress={() => setSelectedDateIndex(index)}
                >
                  <ThemedText
                    style={[
                      styles.dateTabText,
                      selectedDateIndex === index && styles.selectedDateTabText,
                    ]}
                  >
                    {dateGroup.dateLabel}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Show theaters and showtimes for selected date */}
          {showtimesByDate.length > 0 &&
          selectedDateIndex < showtimesByDate.length ? (
            showtimesByDate[selectedDateIndex].theaters.map(
              (theaterShowtimes) => (
                <ThemedCard
                  key={theaterShowtimes.theaterId}
                  style={styles.theaterShowtimes}
                  variant="outlined"
                  elevation="none"
                  padding="none"
                  borderRadius="medium"
                >
                  <View style={styles.theaterHeader}>
                    <ThemedText style={styles.theaterName}>
                      {theaterShowtimes.theaterName}
                    </ThemedText>
                    <ThemedText style={styles.distance}>
                      {theaterShowtimes.distance}
                    </ThemedText>
                  </View>

                  <View style={styles.showtimesGrid}>
                    {theaterShowtimes.showtimes.map((showtime) => {
                      const { time, period } = formatTime(showtime.startTime);

                      return (
                        <TouchableOpacity
                          key={showtime.id}
                          style={styles.showtimeItem}
                          onPress={() => handleBookTickets(showtime.id)}
                        >
                          <ThemedText style={styles.showtimeTime}>
                            {time}
                          </ThemedText>
                          <ThemedText style={styles.showtimePeriod}>
                            {period}
                          </ThemedText>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </ThemedCard>
              )
            )
          ) : (
            <View style={styles.noShowtimesContainer}>
              <Ionicons
                name="calendar-outline"
                size={40}
                color={
                  isDark
                    ? UIColors.dark.textSecondary
                    : UIColors.light.textSecondary
                }
              />
              <ThemedText style={styles.noShowtimesText}>
                No showtimes available for this movie
              </ThemedText>
            </View>
          )}
        </ThemedCard>

        {/* Book Tickets Button */}
        {showtimesByDate.length > 0 &&
          selectedDateIndex < showtimesByDate.length &&
          showtimesByDate[selectedDateIndex].theaters.length > 0 &&
          showtimesByDate[selectedDateIndex].theaters[0].showtimes.length >
            0 && (
            <ThemedButton
              variant="primary"
              size="large"
              style={{ marginHorizontal: 16, marginBottom: 40 }}
              onPress={() => {
                // Navigate to first showtime of selected date
                handleBookTickets(
                  showtimesByDate[selectedDateIndex].theaters[0].showtimes[0].id
                );
              }}
            >
              Book Tickets
            </ThemedButton>
          )}
      </ScrollView>
    </ThemeAwareScreen>
  );
}
