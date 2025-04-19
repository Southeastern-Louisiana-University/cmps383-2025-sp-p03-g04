import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../components/AuthProvider";
import { useTheme } from "../../../components/ThemeProvider";
import { ThemedView } from "../../../components/ThemedView";
import { ThemedText } from "../../../components/ThemedText";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { useBooking } from "../../../components/BookingProvider";

import * as movieService from "../../../services/movies/movieService";
import * as theaterService from "../../../services/theaters/theaterService";

import { SeatingLayout } from "../../../types/models/theater";

export default function SeatSelectionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  const booking = useBooking();
  const [seatingLayout, setSeatingLayout] = useState<SeatingLayout | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const showtimeData = await movieService.getShowtime(Number(id));
      booking.setShowtimeInfo(Number(id), showtimeData);

      const showtimeId = Number(id);
      const userId = user?.id;
      const layout = await theaterService.getSeatsForShowtime(showtimeId, userId);
      setSeatingLayout(layout);
    } catch (error) {
      console.error("Failed to load seating data:", error);
      Alert.alert("Error", "Failed to load seats. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeatPress = (seatId: number) => {
    booking.toggleSeatSelection(seatId);
  };

  const handleTicketTypeChange = (seatId: number, type: string) => {
    booking.setTicketType(seatId, type);
  };

  const handleContinue = async () => {
    if (booking.selectedSeats.length === 0) {
      Alert.alert("Select Seats", "Please select at least one seat to continue.");
      return;
    }

    await booking.saveBookingProgress();

    if (!isAuthenticated) {
      Alert.alert("Continue Booking", "Would you like to sign in or continue as a guest?", [
        {
          text: "Sign In",
          onPress: () => {
            router.push(`/login?returnTo=/booking/${id}/food-option`);
          },
        },
        {
          text: "Continue as Guest",
          onPress: () => {
            router.push(`./booking/${id}/food-option`);
          },
        },
      ]);
    } else {
      const reservationId = await booking.createReservation();
      if (reservationId) {
        router.push({
          pathname: `./booking/${id}/food-option`,
          params: { reservationId: reservationId.toString() },
        });
      }
    }
  };

  if (isLoading || !seatingLayout || !booking.showtime) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B4D335" />
        <ThemedText style={styles.loadingText}>Loading seating layout...</ThemedText>
      </ThemedView>
    );
  }

  const sortedRowKeys = Object.keys(seatingLayout.rows).sort();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Select Seats",
          headerStyle: {
            backgroundColor: isDark ? "#1E2429" : "#FFFFFF",
          },
          headerTitleStyle: {
            color: isDark ? "#FFFFFF" : "#242424",
          },
          headerTintColor: isDark ? "#FFFFFF" : "#242424",
        }}
      />

      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.movieInfoContainer}>
            <ThemedText style={styles.movieTitle}>{booking.showtime.movieTitle}</ThemedText>
            <ThemedText style={styles.showtimeInfo}>
              {new Date(booking.showtime.startTime).toLocaleString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </ThemedText>
            <ThemedText style={styles.theaterInfo}>
              {booking.showtime.theaterName} • {booking.showtime.screenName}
            </ThemedText>
          </View>

          <View style={styles.seatMapContainer}>
            <View style={styles.screen}>
              <ThemedText style={styles.screenText}>Screen</ThemedText>
            </View>

            {sortedRowKeys.map((rowKey) => (
              <View key={rowKey} style={styles.row}>
                <View style={styles.rowLabel}>
                  <ThemedText style={styles.rowLabelText}>{rowKey}</ThemedText>
                </View>
                <View style={styles.seats}>
                  {seatingLayout.rows[rowKey].map((seat) => {
                    const isSelected = booking.selectedSeats.includes(seat.id);
                    const isTaken = seat.status === "Taken";

                    return (
                      <TouchableOpacity
                        key={seat.id}
                        style={[
                          styles.seat,
                          isTaken && styles.takenSeat,
                          isSelected && styles.selectedSeat,
                        ]}
                        onPress={() => !isTaken && handleSeatPress(seat.id)}
                        disabled={isTaken}
                      >
                        <ThemedText
                          style={[
                            styles.seatText,
                            isSelected && styles.selectedSeatText,
                            isTaken && styles.takenSeatText,
                          ]}
                        >
                          {seat.number}
                        </ThemedText>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}

            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendBox, styles.availableSeat]} />
                <ThemedText style={styles.legendText}>Available</ThemedText>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendBox, styles.selectedSeat]} />
                <ThemedText style={styles.legendText}>Selected</ThemedText>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendBox, styles.takenSeat]} />
                <ThemedText style={styles.legendText}>Taken</ThemedText>
              </View>
            </View>
          </View>

          {booking.selectedSeats.length > 0 && (
            <View style={styles.ticketSection}>
              <ThemedText style={styles.sectionTitle}>Ticket Types</ThemedText>
              {booking.selectedSeats.map((seatId) => {
                let seatRow = "";
                let seatNumber = 0;

                for (const rowKey in seatingLayout.rows) {
                  const seat = seatingLayout.rows[rowKey].find((s) => s.id === seatId);
                  if (seat) {
                    seatRow = seat.row;
                    seatNumber = seat.number;
                    break;
                  }
                }

                return (
                  <View key={seatId} style={styles.ticketTypeRow}>
                    <ThemedText style={styles.seatLabel}>
                      Seat {seatRow}{seatNumber}:
                    </ThemedText>
                    <View style={styles.ticketTypeButtons}>
                      {["Adult", "Child", "Senior"].map((type) => (
                        <TouchableOpacity
                          key={type}
                          style={[
                            styles.typeButton,
                            (booking.ticketTypes[seatId] || "Adult") === type && styles.selectedTypeButton,
                          ]}
                          onPress={() => handleTicketTypeChange(seatId, type)}
                        >
                          <ThemedText
                            style={[
                              styles.typeButtonText,
                              (booking.ticketTypes[seatId] || "Adult") === type && styles.selectedTypeText,
                            ]}
                          >
                            {type}
                          </ThemedText>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Selected Seats:</ThemedText>
              <ThemedText style={styles.summaryValue}>
                {booking.selectedSeats.length > 0
                  ? booking.selectedSeats
                      .map((seatId) => {
                        for (const rowKey in seatingLayout.rows) {
                          const seat = seatingLayout.rows[rowKey].find((s) => s.id === seatId);
                          if (seat) return `${seat.row}${seat.number}`;
                        }
                        return "";
                      })
                      .join(", ")
                  : "None"}
              </ThemedText>
            </View>
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Ticket Count:</ThemedText>
              <ThemedText style={styles.summaryValue}>{booking.selectedSeats.length}</ThemedText>
            </View>
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Total:</ThemedText>
              <ThemedText style={styles.totalPrice}>
                ${booking.selectedSeats.reduce((total, seatId) => {
                  const ticketType = booking.ticketTypes[seatId] || "Adult";
                  const price = ticketType === "Child" ? 8 : ticketType === "Senior" ? 10 : 12;
                  return total + price;
                }, 0).toFixed(2)}
              </ThemedText>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.continueButton,
              (booking.selectedSeats.length === 0 || isLoading) && styles.disabledButton,
            ]}
            onPress={handleContinue}
            disabled={booking.selectedSeats.length === 0 || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <ThemedText style={styles.continueButtonText}>
                Continue to Payment
              </ThemedText>
            )}
          </TouchableOpacity>
        </ScrollView>
        <ThemeToggle position="bottomRight" size={40} />
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    color: "#9BA1A6",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  movieInfoContainer: {
    marginBottom: 20,
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  showtimeInfo: {
    fontSize: 16,
    color: "#B4D335",
    marginBottom: 4,
  },
  theaterInfo: {
    fontSize: 14,
    color: "#9BA1A6",
  },
  seatMapContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  screen: {
    width: "80%",
    height: 20,
    backgroundColor: "#0A7EA4",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  screenText: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  rowLabel: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabelText: {
    fontSize: 14,
    fontWeight: "500",
  },
  seats: {
    flexDirection: "row",
  },
  seat: {
    width: 30,
    height: 30,
    borderRadius: 6,
    margin: 3,
    backgroundColor: "#1E3A55",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedSeat: {
    backgroundColor: "#B4D335",
  },
  takenSeat: {
    backgroundColor: "#666666",
  },
  seatText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  selectedSeatText: {
    color: "#242424",
  },
  takenSeatText: {
    color: "#999999",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  legendBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 5,
  },
  availableSeat: {
    backgroundColor: "#1E3A55",
  },
  legendText: {
    fontSize: 12,
  },
  ticketSection: {
    backgroundColor: "#262D33",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  ticketTypeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  seatLabel: {
    fontSize: 16,
    width: "30%",
  },
  ticketTypeButtons: {
    flexDirection: "row",
    width: "70%",
    justifyContent: "space-around",
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#B4D335",
    minWidth: 60,
    alignItems: "center",
  },
  selectedTypeButton: {
    backgroundColor: "#B4D335",
  },
  typeButtonText: {
    fontSize: 14,
  },
  selectedTypeText: {
    color: "#1E2429",
    fontWeight: "bold",
  },
  summaryContainer: {
    backgroundColor: "#262D33",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  totalPrice: {
    fontSize: 18,
    color: "#B4D335",
    fontWeight: "bold",
  },
  continueButton: {
    backgroundColor: "#B4D335",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: "#4A4A4A",
    opacity: 0.7,
  },
  continueButtonText: {
    color: "#1E2429",
    fontSize: 16,
    fontWeight: "bold",
  },
});
