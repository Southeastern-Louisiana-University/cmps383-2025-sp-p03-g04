import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Movie } from "../types/models/movie";
import { MovieCarouselProps } from "../types/components/movieComponents";
import { movieCarouselStyles as styles } from "../styles/components/movieCarousel";

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
        <ThemedText style={styles.title} numberOfLines={2}>
          {item.title}
        </ThemedText>
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

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.33;
