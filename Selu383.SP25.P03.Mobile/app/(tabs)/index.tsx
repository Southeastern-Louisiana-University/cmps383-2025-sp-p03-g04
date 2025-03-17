import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Stack } from 'expo-router';

import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { MovieCarousel, Movie } from '../../components/MovieCarousel';
import { TodaysShowsList, Showtime } from '../../components/TodaysShowsList';
import { TheaterSelector, Theater } from '../../components/TheaterSelector';
import * as moviesAPI from '../../services/movies';
import * as theatersAPI from '../../services/theaters';
import * as showtimesAPI from '../../services/showtimes';

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  // Filter showtimes based on selected theater
  useEffect(() => {
    if (selectedTheater) {
      // Filter showtimes to show only those for the selected theater
      const filteredShowtimes = showtimes.filter(
        showtime => showtime.theaterId === selectedTheater.id
      );
      setShowtimes(filteredShowtimes);
    } else {
      // Load all showtimes if no theater is selected
      showtimesAPI.getShowtimes().then(data => setShowtimes(data));
    }
  }, [selectedTheater]);

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

      // Fetch showtimes
      const showtimesData = await showtimesAPI.getShowtimes();
      setShowtimes(showtimesData);
    } catch (error) {
      console.error('Failed to load data:', error);
      // Handle error state here
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSelectMovie = (movieId: number) => {
    // Handle movie selection (e.g., navigate to movie details)
    console.log('Selected movie ID:', movieId);
  };

  const handleSelectShowtime = (showtimeId: number) => {
    // Handle showtime selection (e.g., navigate to seat selection)
    console.log('Selected showtime ID:', showtimeId);
  };

  const handleSelectTheater = (theater: Theater) => {
    setSelectedTheater(theater);
  };

  return (
    <>
      <Stack.Screen options={{ title: "Lion's Den Cinema" }} />
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

          <TheaterSelector 
            theaters={theaters}
            selectedTheater={selectedTheater}
            onSelectTheater={handleSelectTheater}
          />

          <MovieCarousel 
            movies={movies}
            onSelectMovie={handleSelectMovie}
          />

          <TodaysShowsList 
            showtimes={showtimes}
            onSelectShowtime={handleSelectShowtime}
          />
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
    paddingVertical: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});