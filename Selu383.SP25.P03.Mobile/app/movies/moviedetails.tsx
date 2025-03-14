import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function MovieDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string; // Ensure id is a string

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Movie Details (ID: {id})</Text>
      <Button title="Select Showtime" onPress={() => router.push({ pathname: "movies/SelectShowtime", params: { id } })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
});

