// app/movie/[id].tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ScrollView, Linking, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import * as moviesAPI from '../../services/movies';
import * as showtimesAPI from '../../services/showtimes';
import * as tmdbAPI from '../../services/tmdb';

// Extended movie interface for details page
interface MovieDetails {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  rating: string;
  runtime: number;
  releaseDate: Date;
  genre?: string;
  trailerUrl?: string;
  tmdbId?: number; // Add tmdbId property
}

interface ShowtimesByTheater {
  theaterId: number;
  theaterName: string;
  distance?: string; // For future implementation
  showtimes: {
    id: number;
    startTime: string;
  }[];
}

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [showtimesByTheater, setShowtimesByTheater] = useState<ShowtimesByTheater[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trailerLoading, setTrailerLoading] = useState(false);
  
// app/movie/[id].tsx
// Modify the API call section in useEffect

// app/movie/[id].tsx - Update the useEffect to handle the movie data safely
useEffect(() => {
    const fetchMovieDetails = async () => {
      setIsLoading(true);
      try {
        // Fetch basic movie details
        const movieData = await moviesAPI.getMovie(Number(id));
        
        // Safely create a MovieDetails object with only the properties we have
        const movieDetails: MovieDetails = {
          id: movieData.id,
          title: movieData.title,
          description: movieData.description || '',
          posterUrl: movieData.posterUrl,
          rating: movieData.rating || 'PG',
          runtime: movieData.runtime,
          releaseDate: movieData.releaseDate || new Date(),
          genre: 'Sci-Fi/Adventure', // Hardcoded for now
        };
        
        // Set trailer URL directly for now (simplified approach)
        const trailerUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(movieData.title)}+trailer`;
        movieDetails.trailerUrl = trailerUrl;
        
        // Fetch showtimes for this movie
        const allShowtimes = await showtimesAPI.getShowtimesByMovie(Number(id));
        
        // Group showtimes by theater
        const theaterShowtimes: Record<number, ShowtimesByTheater> = {};
        
        allShowtimes.forEach(showtime => {
          if (!theaterShowtimes[showtime.theaterId]) {
            theaterShowtimes[showtime.theaterId] = {
              theaterId: showtime.theaterId,
              theaterName: showtime.theaterName,
              distance: '2.5 miles', // Example
              showtimes: []
            };
          }
          
          theaterShowtimes[showtime.theaterId].showtimes.push({
            id: showtime.id,
            startTime: showtime.startTime
          });
        });
        
        setMovie(movieDetails);
        setShowtimesByTheater(Object.values(theaterShowtimes));
      } catch (error) {
        console.error('Error fetching movie details:', error);
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
        const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(movie?.title || '')}+trailer`;
        await Linking.openURL(youtubeUrl);
      } catch (error) {
        console.error('Failed to open trailer:', error);
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
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // Hour '0' should be '12'
    
    return {
      time: `${hours}:${minutes.toString().padStart(2, '0')}`,
      period: ampm
    };
  };
  
  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#65a30d" />
        <ThemedText style={styles.loadingText}>Loading movie details...</ThemedText>
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
          title: 'Movie Details',
          headerStyle: {
            backgroundColor: '#292929',
          },
          headerTitleStyle: {
            color: 'white'
          },
          headerTintColor: 'white',
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
                <ThemedText style={styles.ratingText}>{movie.rating}</ThemedText>
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
                <ThemedText style={styles.trailerButtonText}>Trailer</ThemedText>
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
            <View key={theaterShowtimes.theaterId} style={styles.theaterShowtimes}>
              <View style={styles.theaterHeader}>
                <ThemedText style={styles.theaterName}>{theaterShowtimes.theaterName}</ThemedText>
                <ThemedText style={styles.distance}>{theaterShowtimes.distance}</ThemedText>
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
                      <ThemedText style={styles.showtimeTime}>{time}</ThemedText>
                      <ThemedText style={styles.showtimePeriod}>{period}</ThemedText>
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
            if (showtimesByTheater.length > 0 && 
                showtimesByTheater[0].showtimes.length > 0) {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#292929',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#292929',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
  },
  movieHeader: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#292929',
  },
  poster: {
    width: 150,
    height: 225,
    borderRadius: 8,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    width: 80,
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: 'white',
  },
  ratingBadge: {
    backgroundColor: '#1e293b',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  ratingText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  trailerButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  trailerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  synopsisContainer: {
    padding: 16,
    backgroundColor: '#333333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  synopsis: {
    fontSize: 16,
    color: 'white',
    lineHeight: 24,
  },
  showtimesContainer: {
    padding: 16,
    backgroundColor: '#292929',
  },
  theaterShowtimes: {
    marginBottom: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    overflow: 'hidden',
  },
  theaterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  theaterName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  distance: {
    fontSize: 14,
    color: '#9BA1A6',
  },
  showtimesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
  },
  showtimeItem: {
    width: 70,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
    padding: 8,
    alignItems: 'center',
  },
  showtimeTime: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  showtimePeriod: {
    fontSize: 12,
    color: '#9BA1A6',
  },
  bookButton: {
    backgroundColor: '#65a30d',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40, // Extra padding at bottom for scrolling
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});