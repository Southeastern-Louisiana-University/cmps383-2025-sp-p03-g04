import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Checkout() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;
  const showtime = params.showtime as string;
  const seats = (params.seats as string[]) || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Your Booking</Text>
      <Text>Movie ID: {id}</Text>
      <Text>Showtime: {showtime}</Text>
      <Text>Seats: {seats.join(", ")}</Text>
      <Button title="Confirm Booking" onPress={() => router.replace("../MovieList")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
});
