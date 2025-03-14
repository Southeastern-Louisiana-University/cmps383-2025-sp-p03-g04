import { Stack } from 'expo-router';

export default function MovieStack() {
  return (
    <Stack>
      <Stack.Screen name="MovieList" options={{ title: "Movies" }} />
      <Stack.Screen name="MovieDetails" options={{ title: "Movie Details" }} />
      <Stack.Screen name="SelectShowtime" options={{ title: "Select Showtime" }} />
      <Stack.Screen name="SelectSeats" options={{ title: "Select Seats" }} />
      <Stack.Screen name="Checkout" options={{ title: "Checkout" }} />
    </Stack>
  );
}
