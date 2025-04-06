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

import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { Movie, Showtime } from "../../types/models/movie";
import { ShowtimesByTheater } from "../../types/models/movie";
import { movieDetailsStyles as styles } from "../../styles/screens/movieDetails";

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
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimesByDate, setShowtimesByDate] = useState<ShowtimesByDate[]>([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [trailerLoading, setTrailerLoading] = useState(false);

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
        <ActivityIndicator size="large" color="#65a30d" />
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
            backgroundColor: "#292929",
          },
          headerTitleStyle: {
            color: "white",
          },
          headerTintColor: "white",
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
              <ThemedText style={styles.detailValue}>{movie.genre}</ThemedText>
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
                  Trailer
                </ThemedText>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.synopsisContainer}>
          <ThemedText style={styles.sectionTitle}>Synopsis</ThemedText>
          <ThemedText style={styles.synopsis}>{movie.description}</ThemedText>
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
              <Ionicons name="calendar-outline" size={40} color="#666" />
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
                  showtimesByDate[selectedDateIndex].theaters[0].showtimes[0].id
                );
              }}
            >
              <ThemedText style={styles.bookButtonText}>
                Book Tickets
              </ThemedText>
            </TouchableOpacity>
          )}
      </ScrollView>
    </>
  );
}
