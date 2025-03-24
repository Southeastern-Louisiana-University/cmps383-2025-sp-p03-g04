import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

// Define the movie type
export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  runtime: number;
  description?: string; 
  rating?: string;      
  releaseDate?: Date;   
  tmdbId?: number;      
}

interface MovieCarouselProps {
  movies: Movie[];
  onSelectMovie?: (movieId: number) => void;
}

export function MovieCarousel({ movies, onSelectMovie }: MovieCarouselProps) {
  const renderMovieItem = ({ item }: { item: Movie }) => {
    const minutes = item.runtime;
    
    return (
      <TouchableOpacity 
        style={styles.movieItem} 
        onPress={() => onSelectMovie && onSelectMovie(item.id)}
      >
        <Image 
          source={{ uri: item.posterUrl }} 
          style={styles.poster} 
          resizeMode="cover"
        />
        <ThemedText style={styles.title} numberOfLines={2}>{item.title}</ThemedText>
        <ThemedText style={styles.runtime}>{minutes} min</ThemedText>
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.heading}>Now Playing</ThemedText>
      <FlatList
        data={movies}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </ThemedView>
  );
}

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.33;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 10,
  },
  list: {
    paddingHorizontal: 10,
  },
  movieItem: {
    width: ITEM_WIDTH,
    marginRight: 12,
  },
  poster: {
    width: '100%',
    height: ITEM_WIDTH * 1.5,
    borderRadius: 8,
  },
  title: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  runtime: {
    fontSize: 12,
    marginTop: 2,
  },
});