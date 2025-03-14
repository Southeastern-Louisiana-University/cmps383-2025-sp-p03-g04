import { useRouter } from 'expo-router';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const movies = [
  { id: '1', title: 'Inception' },
  { id: '2', title: 'Avatar' },
  { id: '3', title: 'Interstellar' },
];

export default function MovieList() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/movies/MovieDetails", // ✅ Ensure correct path
                params: { id: String(item.id) }, // ✅ Ensure `id` is explicitly a string
              })
            }
          >
            <Text style={styles.movieItem}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  movieItem: { fontSize: 20, padding: 10, borderBottomWidth: 1 },
});
