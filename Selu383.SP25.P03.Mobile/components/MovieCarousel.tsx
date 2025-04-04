// import React from "react";
// import {
//   Dimensions,
//   FlatList,
//   Image,
//   TouchableOpacity,
//   View,
//   StyleSheet,
// } from "react-native";
// import { ThemedView } from "./ThemedView";
// import { ThemedText } from "./ThemedText";
// import { Movie } from "../types/models/movie";
// import { MovieCarouselProps } from "../types/components/movieComponents";
// import { movieCarouselStyles as styles } from "../styles/components/movieCarousel";

// const MAX_MOVIES_PER_CAROUSEL = 8; // Limit movies per carousel

// export function MovieCarousel({ movies, onSelectMovie }: MovieCarouselProps) {
//   // Split movies into chunks of MAX_MOVIES_PER_CAROUSEL
//   const movieChunks: Movie[][] = [];
//   for (let i = 0; i < movies.length; i += MAX_MOVIES_PER_CAROUSEL) {
//     movieChunks.push(movies.slice(i, i + MAX_MOVIES_PER_CAROUSEL));
//   }

//   const renderMovieItem = ({ item }: { item: Movie }) => {
//     const minutes = item.runtime;

//     return (
//       <TouchableOpacity
//         style={styles.movieItem}
//         onPress={() => onSelectMovie && onSelectMovie(item.id)}
//       >
//         <View style={styles.posterContainer}>
//           <Image
//             source={{ uri: item.posterUrl }}
//             style={styles.poster}
//             resizeMode="cover"
//           />
//         </View>
//         <ThemedText style={styles.title} numberOfLines={2}>
//           {item.title}
//         </ThemedText>
//         <ThemedText style={styles.runtime}>{minutes} min</ThemedText>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <ThemedView style={styles.container}>
//       <ThemedText style={styles.heading}>Now Playing</ThemedText>

//       {movieChunks.map((chunk, index) => (
//         <FlatList
//           key={`movie-carousel-${index}`}
//           data={chunk}
//           renderItem={renderMovieItem}
//           keyExtractor={(item) => item.id.toString()}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.list}
//           style={{ marginBottom: index < movieChunks.length - 1 ? 20 : 0 }}
//         />
//       ))}
//     </ThemedView>
//   );
// }

// components/MovieCarousel.tsx - Ensure all text is in Text components
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
        <View style={styles.posterContainer}>
          <Image
            source={{ uri: item.posterUrl }}
            style={styles.poster}
            resizeMode="cover"
          />
        </View>
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
