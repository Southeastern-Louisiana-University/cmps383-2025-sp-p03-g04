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
import { Movie } from "../../types/models/movie";
import { ShowtimesByTheater } from "../../types/models/movie";
import { movieDetailsStyles as styles } from "../../styles/screens/movieDetails";

// Import from the new service structure
import {
  getMovie,
  getShowtimesByMovie,
} from "../../services/movies/movieService";
import { getMovieDetails } from "../../services/movies/tmdbService";

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimesByTheater, setShowtimesByTheater] = useState<
    ShowtimesByTheater[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trailerLoading, setTrailerLoading] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setIsLoading(true);
      try {
        // Fetch basic movie details
        const movieData = await getMovie(Number(id));

        setMovie(movieData);

        // Fetch showtimes for this movie
        const allShowtimes = await getShowtimesByMovie(Number(id));

        // Group showtimes by theater
        const theaterShowtimes: Record<number, ShowtimesByTheater> = {};

        allShowtimes.forEach((showtime) => {
          if (!theaterShowtimes[showtime.theaterId]) {
            theaterShowtimes[showtime.theaterId] = {
              theaterId: showtime.theaterId,
              theaterName: showtime.theaterName,
              distance: "2.5 miles", // Example
              showtimes: [],
            };
          }

          theaterShowtimes[showtime.theaterId].showtimes.push({
            id: showtime.id,
            startTime: showtime.startTime,
          });
        });

        setShowtimesByTheater(Object.values(theaterShowtimes));
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

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
    router.push(`/book/${showtimeId}/seats`);
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
          <ThemedText style={styles.sectionTitle}>Today's Showtimes</ThemedText>

          {showtimesByTheater.map((theaterShowtimes) => (
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
          ))}
        </View>

        {/* Book Tickets Button */}
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => {
            // Navigate to first showtime by default
            if (
              showtimesByTheater.length > 0 &&
              showtimesByTheater[0].showtimes.length > 0
            ) {
              handleBookTickets(showtimesByTheater[0].showtimes[0].id);
            }
          }}
        >
          <ThemedText style={styles.bookButtonText}>Book Tickets</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}
