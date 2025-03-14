import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function SelectShowtime() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string; // ✅ Ensure `id` is treated as a string

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Showtime for Movie ID: {id}</Text>
      <Button
        title="Select 7:30 PM Showtime"
        onPress={() =>
          router.push({
            pathname: "movies/[id]/[showtimeid]/seats", // ✅ Correct path format (no leading `/`)
            params: { id: MovieDetails,: "7:30 PM" }, // ✅ Ensure `id` and `showtime` are strings
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
});
