// app/(tabs)/index.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, RefreshControl, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';

import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { MovieCarousel, Movie } from '../../components/MovieCarousel';
import { Showtime } from '../../components/TodaysShowsList';
import { Theater } from '../../components/TheaterSelector';
import * as moviesAPI from '../../services/movies';
import * as theatersAPI from '../../services/theaters';
import * as showtimesAPI from '../../services/showtimes';

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isTheaterDropdownVisible, setIsTheaterDropdownVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  // Filter showtimes based on selected theater
  useEffect(() => {
    if (selectedTheater) {
      showtimesAPI.getShowtimesByTheater(selectedTheater.id).then(data => setShowtimes(data));
    } else if (theaters.length > 0) {
      // Default to first theater if none selected
      setSelectedTheater(theaters[0]);
      showtimesAPI.getShowtimesByTheater(theaters[0].id).then(data => setShowtimes(data));
    } else {
      // Load all showtimes if no theaters available
      showtimesAPI.getShowtimes().then(data => setShowtimes(data));
    }
  }, [selectedTheater, theaters]);

  const loadData = async () => {
    try {
      // Fetch movies
      const moviesData = await moviesAPI.getMovies();
      setMovies(moviesData);

      // Fetch theaters
      const theatersData = await theatersAPI.getTheaters();
      setTheaters(theatersData);
      
      // Set default selected theater if available
      if (theatersData.length > 0 && !selectedTheater) {
        setSelectedTheater(theatersData[0]);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

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
    router.push('/tickets');
  };

  const navigateToConcessions = () => {
    router.push('/concessions');
  };

  // Group showtimes by movie
  const groupedByMovie: Record<number, Showtime[]> = {};
  
  showtimes.forEach(showtime => {
    if (!groupedByMovie[showtime.movieId]) {
      groupedByMovie[showtime.movieId] = [];
    }
    groupedByMovie[showtime.movieId].push(showtime);
  });

  return (
    <>
      <Stack.Screen 
        options={{
          title: selectedTheater ? selectedTheater.name : "Theater",
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => setIsTheaterDropdownVisible(!isTheaterDropdownVisible)}
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
              <ThemedText style={styles.dropdownText}>{theater.name}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      <ThemedView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          <ThemedText style={styles.welcomeText}>
            Welcome to Lion's Den Cinema
          </ThemedText>

          <MovieCarousel 
            movies={movies}
            onSelectMovie={handleSelectMovie}
          />

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={navigateToTickets}
            >
              <Ionicons name="ticket-outline" size={24} color="white" />
              <ThemedText style={styles.actionButtonText}>My Tickets</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={navigateToConcessions}
            >
              <Ionicons name="fast-food-outline" size={24} color="white" />
              <ThemedText style={styles.actionButtonText}>Order Food</ThemedText>
            </TouchableOpacity>
          </View>

          <ThemedText style={styles.sectionTitle}>Today's Showtimes</ThemedText>

          {/* Showtimes by Movie */}
          {Object.entries(groupedByMovie).map(([movieId, movieShowtimes]) => {
            if (movieShowtimes.length === 0) return null;
            
            const movieData = movieShowtimes[0];
            
            return (
              <View key={movieId} style={styles.movieShowtimesContainer}>
                <ThemedText style={styles.movieTitle}>{movieData.movieTitle}</ThemedText>
                <ThemedText style={styles.screenInfo}>{movieData.theaterName} • {movieData.screenName}</ThemedText>
                
                <View style={styles.showtimesGrid}>
                  {movieShowtimes.map((showtime) => {
                    // Format the time
                    const date = new Date(showtime.startTime);
                    const timeString = date.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                    
                    return (
                      <TouchableOpacity
                        key={showtime.id}
                        style={styles.showtimeBox}
                        onPress={() => handleSelectShowtime(showtime.id)}
                      >
                        <ThemedText style={styles.showtimeText}>{timeString}</ThemedText>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  dropdown: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    backgroundColor: '#65a30d',
    zIndex: 999,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  dropdownText: {
    fontSize: 16,
    color: '#242424',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#1E3A55',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  movieShowtimesContainer: {
    marginBottom: 20,
    backgroundColor: '#1E2429',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  screenInfo: {
    fontSize: 14,
    color: '#9BA1A6',
    marginBottom: 12,
  },
  showtimesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  showtimeBox: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  showtimeText: {
    color: 'white',
    fontWeight: '500',
  },
});