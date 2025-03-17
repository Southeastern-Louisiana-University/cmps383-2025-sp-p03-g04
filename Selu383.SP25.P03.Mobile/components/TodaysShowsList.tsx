import React from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

// Define the types for showtimes and movies
export interface Showtime {
  id: number;
  startTime: string;
  movieId: number;
  movieTitle: string;
  screenId: number;
  screenName: string;
  theaterId: number;
  theaterName: string;
  ticketPrice: number;
}

interface TodaysShowsListProps {
  showtimes: Showtime[];
  onSelectShowtime?: (showtimeId: number) => void;
}

export function TodaysShowsList({ showtimes, onSelectShowtime }: TodaysShowsListProps) {
  // Group showtimes by movie
  const groupedByMovie: Record<number, Showtime[]> = {};
  
  showtimes.forEach(showtime => {
    if (!groupedByMovie[showtime.movieId]) {
      groupedByMovie[showtime.movieId] = [];
    }
    groupedByMovie[showtime.movieId].push(showtime);
  });

  const renderShowtimeItem = ({ item }: { item: Showtime }) => {
    // Format the date
    const dateTimeString = new Date(item.startTime).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
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
          <ThemedText style={styles.movieTitle}>{movieData.movieTitle}</ThemedText>
          <ThemedText style={styles.theaterName}>{movieData.theaterName} • {movieData.screenName}</ThemedText>
          
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

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingBottom: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 12,
  },
  movieSection: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  theaterName: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 10,
  },
  showtimesList: {
    marginTop: 8,
  },
  showtimeButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#0a7ea4',
    marginRight: 10,
  },
  showtimeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  }
});