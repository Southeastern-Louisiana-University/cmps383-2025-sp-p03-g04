import React from "react";
import { StyleSheet, FlatList, TouchableOpacity, View } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Showtime } from "../types/models/movie";
import { ShowtimeListProps } from "../types/components/movieComponents";
import { todaysShowsListStyles as styles } from "../styles/components/todaysShowList";

interface TodaysShowsListProps {
  showtimes: Showtime[];
  onSelectShowtime?: (showtimeId: number) => void;
}

export function TodaysShowsList({
  showtimes,
  onSelectShowtime,
}: TodaysShowsListProps) {
  // Group showtimes by movie
  const groupedByMovie: Record<number, Showtime[]> = {};

  showtimes.forEach((showtime) => {
    if (!groupedByMovie[showtime.movieId]) {
      groupedByMovie[showtime.movieId] = [];
    }
    groupedByMovie[showtime.movieId].push(showtime);
  });

  const renderShowtimeItem = ({ item }: { item: Showtime }) => {
    // Format the date
    const dateTimeString = new Date(item.startTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <TouchableOpacity
        style={styles.showtimeButton}
        onPress={() => onSelectShowtime && onSelectShowtime(item.id)}
      >
        <ThemedText style={styles.showtimeText}>{dateTimeString}</ThemedText>
      </TouchableOpacity>
    );
  };

  const renderMovieShowtimes = () => {
    return Object.entries(groupedByMovie).map(([movieId, movieShowtimes]) => {
      if (movieShowtimes.length === 0) return null;

      const movieData = movieShowtimes[0];

      return (
        <ThemedView key={movieId} style={styles.movieSection}>
          <ThemedText style={styles.movieTitle}>
            {movieData.movieTitle}
          </ThemedText>
          <ThemedText style={styles.theaterName}>
            {movieData.theaterName} • {movieData.screenName}
          </ThemedText>

          <FlatList
            data={movieShowtimes}
            renderItem={renderShowtimeItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.showtimesList}
          />
        </ThemedView>
      );
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.heading}>Today's Showtimes</ThemedText>
      {renderMovieShowtimes()}
    </ThemedView>
  );
}
