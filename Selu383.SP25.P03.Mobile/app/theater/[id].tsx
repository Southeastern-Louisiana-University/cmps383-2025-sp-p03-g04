// File: app/theater/[id].tsx
import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";

import * as theaterService from "../../services/theaters/theaterService";
import * as movieService from "../../services/movies/movieService";

import { Theater } from "../../types/models/theater";
import { Showtime } from "../../types/models/movie";

export default function TheaterDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [theater, setTheater] = useState<Theater | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load theater details
        const theaterData = await theaterService.getTheater(Number(id));
        setTheater(theaterData);

        // Load showtimes for this theater
        const theaterShowtimes = await movieService.getShowtimesByTheater(
          Number(id)
        );
        setShowtimes(theaterShowtimes);
      } catch (error) {
        console.error("Error loading theater data:", error);
        Alert.alert("Error", "Failed to load theater information");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleShowtimeSelect = (showtimeId: number) => {
    // Navigate to booking flow without requiring authentication
    router.push(`/booking/${showtimeId}/seats`);
  };

  // Create groups of showtimes by movie
  const showtimesByMovie = showtimes.reduce(
    (groups: Record<number, Showtime[]>, showtime) => {
      if (!groups[showtime.movieId]) {
        groups[showtime.movieId] = [];
      }
      groups[showtime.movieId].push(showtime);
      return groups;
    },
    {}
  );

  if (isLoading) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#B4D335" />
        <ThemedText style={{ marginTop: 16 }}>
          Loading theater details...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: theater?.name || "Theater Details",
          headerStyle: {
            backgroundColor: "#1E2429",
          },
          headerTintColor: "#B4D335",
        }}
      />

      <ThemedView style={{ flex: 1 }}>
        <ScrollView style={{ padding: 16 }}>
          {/* Theater Info */}
          <View style={{ marginBottom: 20 }}>
            <ThemedText
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "white",
                marginBottom: 8,
              }}
            >
              {theater?.name}
            </ThemedText>
            <ThemedText
              style={{ fontSize: 16, color: "#9BA1A6", marginBottom: 4 }}
            >
              {theater?.address}
            </ThemedText>
          </View>

          {/* Showtimes by Movie */}
          <ThemedText
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "white",
              marginBottom: 16,
            }}
          >
            Today's Showtimes
          </ThemedText>

          {Object.keys(showtimesByMovie).length > 0 ? (
            Object.entries(showtimesByMovie).map(
              ([movieId, movieShowtimes]) => (
                <View
                  key={movieId}
                  style={{
                    backgroundColor: "#262D33",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 16,
                  }}
                >
                  <ThemedText
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: "white",
                      marginBottom: 8,
                    }}
                  >
                    {movieShowtimes[0]?.movieTitle}
                  </ThemedText>

                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      marginTop: 12,
                    }}
                  >
                    {movieShowtimes.map((showtime) => (
                      <TouchableOpacity
                        key={showtime.id}
                        style={{
                          backgroundColor: "#1E3A55",
                          paddingVertical: 8,
                          paddingHorizontal: 16,
                          borderRadius: 8,
                          marginRight: 10,
                          marginBottom: 10,
                        }}
                        onPress={() => handleShowtimeSelect(showtime.id)}
                      >
                        <ThemedText
                          style={{ color: "white", fontWeight: "500" }}
                        >
                          {new Date(showtime.startTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )
            )
          ) : (
            <View
              style={{
                alignItems: "center",
                padding: 20,
                backgroundColor: "#262D33",
                borderRadius: 12,
              }}
            >
              <Ionicons name="calendar-outline" size={40} color="#666" />
              <ThemedText
                style={{ color: "#9BA1A6", marginTop: 12, textAlign: "center" }}
              >
                No showtimes available for today
              </ThemedText>
            </View>
          )}
        </ScrollView>
      </ThemedView>
    </>
  );
}
