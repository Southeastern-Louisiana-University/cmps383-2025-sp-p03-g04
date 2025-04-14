import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { ThemeToggle } from "../../components/ThemeToggle";
import { useTheme } from "../../components/ThemeProvider";
import { useAuth } from "../../components/AuthProvider";
import { Movie, Showtime } from "../../types/models/movie";
import { ShowtimesByTheater } from "../../types/models/movie";

import {
  getMovie,
  getShowtimesByMovie,
} from "../../services/movies/movieService";
import { getMovieDetails } from "../../services/movies/tmdbService";

interface ShowtimesByDate {
  date: string;
  dateLabel: string;
  theaters: ShowtimesByTheater[];
}

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { colorScheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const isDark = colorScheme === "dark";

  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimesByDate, setShowtimesByDate] = useState<ShowtimesByDate[]>([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [trailerLoading, setTrailerLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

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

  const handleBookTickets = (showtimeId: number) => {
    router.push({
      pathname: "/booking/[id]/seats",
      params: { id: showtimeId.toString() },
    });
  };

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

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B4D335" />
        <ThemedText style={styles.loadingText}>
          Loading movie details...
        </ThemedText>
      </ThemedView>
    );
  }

  if (!movie) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Movie not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Movie Details",
          headerStyle: {
            backgroundColor: isDark ? "#1E2429" : "#FFFFFF",
          },
          headerTitleStyle: {
            color: isDark ? "white" : "#242424",
          },
          headerTintColor: isDark ? "white" : "#242424",
        }}
      />

      <ThemedView style={styles.container}>
        <ScrollView>
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
                    {movie.rating || "PG-13"}
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
                  {movie.genre || "Action/Adventure"}
                </ThemedText>
              </View>

              <TouchableOpacity
                style={styles.trailerButton}
                onPress={handleWatchTrailer}
                disabled={trailerLoading}
              >
                {trailerLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <ThemedText style={styles.trailerButtonText}>
                    Watch Trailer
                  </ThemedText>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.synopsisContainer}>
            <ThemedText style={styles.sectionTitle}>Synopsis</ThemedText>
            <ThemedText style={styles.synopsis}>
              {movie.description || "No description available."}
            </ThemedText>
          </View>

          <View style={styles.showtimesContainer}>
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
                        selectedDateIndex === index &&
                          styles.selectedDateTabText,
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
                  <View
                    key={theaterShowtimes.theaterId}
                    style={styles.theaterShowtimes}
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
                  </View>
                )
              )
            ) : (
              <View style={styles.noShowtimesContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={40}
                  color={isDark ? "#666" : "#999"}
                />
                <ThemedText style={styles.noShowtimesText}>
                  No showtimes available for this movie
                </ThemedText>
              </View>
            )}
          </View>

          {/* Book Tickets Button */}
          {showtimesByDate.length > 0 &&
            selectedDateIndex < showtimesByDate.length &&
            showtimesByDate[selectedDateIndex].theaters.length > 0 &&
            showtimesByDate[selectedDateIndex].theaters[0].showtimes.length >
              0 && (
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => {
                  // Navigate to first showtime of selected date
                  handleBookTickets(
                    showtimesByDate[selectedDateIndex].theaters[0].showtimes[0]
                      .id
                  );
                }}
              >
                <ThemedText style={styles.bookButtonText}>
                  Book Tickets
                </ThemedText>
              </TouchableOpacity>
            )}
        </ScrollView>

        {/* Theme toggle */}
        <ThemeToggle position="bottomRight" size={40} />
      </ThemedView>
    </>
  );
}

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
    marginTop: 16,
    color: "#9BA1A6",
  },
  movieHeader: {
    flexDirection: "row",
    padding: 16,
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
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 16,
  },
  ratingBadge: {
    backgroundColor: "#1e293b",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  ratingText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  trailerButton: {
    backgroundColor: "#dc2626",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    alignSelf: "flex-start",
  },
  trailerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  synopsisContainer: {
    padding: 16,
    backgroundColor: "#333333",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  synopsis: {
    fontSize: 16,
    lineHeight: 24,
  },
  showtimesContainer: {
    padding: 16,
  },
  dateTabsContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  dateTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#444444",
  },
  selectedDateTab: {
    backgroundColor: "#B4D335",
  },
  dateTabText: {
    color: "white",
    fontSize: 14,
  },
  selectedDateTabText: {
    color: "#242424",
    fontWeight: "bold",
  },
  theaterShowtimes: {
    marginBottom: 20,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    overflow: "hidden",
  },
  theaterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  theaterName: {
    fontSize: 16,
    fontWeight: "600",
  },
  distance: {
    fontSize: 14,
    color: "#9BA1A6",
  },
  showtimesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
  },
  showtimeItem: {
    width: 70,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    padding: 8,
    alignItems: "center",
  },
  showtimeTime: {
    fontSize: 16,
    fontWeight: "500",
  },
  showtimePeriod: {
    fontSize: 12,
    color: "#9BA1A6",
  },
  bookButton: {
    backgroundColor: "#B4D335",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  bookButtonText: {
    color: "#242424",
    fontSize: 18,
    fontWeight: "bold",
  },
  noShowtimesContainer: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "#333333",
    borderRadius: 12,
    marginTop: 10,
  },
  noShowtimesText: {
    color: "#9BA1A6",
    marginTop: 10,
    textAlign: "center",
  },
});
