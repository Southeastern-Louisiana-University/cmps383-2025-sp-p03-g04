import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function SelectSeats() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;
  const showtime = params.showtime as string;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Movie: {id}</Text>
      <Text>Showtime: {showtime}</Text>
      <Button title="Select Seats A1, A2" onPress={() => router.push({ pathname: "/movies/Checkout", params: { id, showtime, seats: ["A1", "A2"] } })} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
});
