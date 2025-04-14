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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../../components/AuthProvider";
import { useTheme } from "../../../components/ThemeProvider";
import { ThemedView } from "../../../components/ThemedView";
import { ThemedText } from "../../../components/ThemedText";
import { ThemeToggle } from "../../../components/ThemeToggle";

import * as theaterService from "../../../services/theaters/theaterService";
import * as reservationService from "../../../services/reservations/reservationService";
import * as movieService from "../../../services/movies/movieService";

import { Seat, SeatingLayout } from "../../../types/models/theater";
import { CreateTicketRequest } from "../../../types/api/reservations";
import { Showtime } from "../../../types/models/movie";

export default function SeatSelectionScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  // State variables
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [seatingLayout, setSeatingLayout] = useState<SeatingLayout | null>(
    null
  );
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [ticketTypes, setTicketTypes] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load showtime details
      const showtimeData = await movieService.getShowtime(Number(id));
      setShowtime(showtimeData);

      // Load seating layout
      const showtimeId = Number(id);
      // If user is logged in, pass their ID to get any selected but unpaid seats
      const userId = user?.id;
      const layout = await theaterService.getSeatsForShowtime(
        showtimeId,
        userId
      );
      setSeatingLayout(layout);
    } catch (error) {
      console.error("Failed to load seating data:", error);
      Alert.alert("Error", "Failed to load seats. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total price when selected seats change
  useEffect(() => {
    if (!seatingLayout) return;

    const basePrice = seatingLayout.ticketPrice;
    const total = selectedSeats.reduce((sum, seatId) => {
      const ticketType = ticketTypes[seatId] || "Adult";

      // Apply discount based on ticket type
      switch (ticketType) {
        case "Child":
          return sum + basePrice * 0.75; // 25% off for children
        case "Senior":
          return sum + basePrice * 0.8; // 20% off for seniors
        default:
          return sum + basePrice; // Full price for adults
      }
    }, 0);

    setTotalPrice(total);
  }, [selectedSeats, ticketTypes, seatingLayout]);

  // Handle seat selection
  const handleSeatPress = (seatId: number) => {
    setSelectedSeats((prevSelected) => {
      // If seat is already selected, remove it
      if (prevSelected.includes(seatId)) {
        // Also remove from ticket types
        const newTicketTypes = { ...ticketTypes };
        delete newTicketTypes[seatId];
        setTicketTypes(newTicketTypes);

        return prevSelected.filter((id) => id !== seatId);
      }

      // Otherwise, add it and set default ticket type to Adult
      setTicketTypes({ ...ticketTypes, [seatId]: "Adult" });
      return [...prevSelected, seatId];
    });
  };

  // Change ticket type for a selected seat
  const handleTicketTypeChange = (seatId: number, type: string) => {
    setTicketTypes({ ...ticketTypes, [seatId]: type });
  };

  // Proceed to payment
  const handleContinue = async () => {
    if (selectedSeats.length === 0) {
      Alert.alert(
        "Select Seats",
        "Please select at least one seat to continue."
      );
      return;
    }

    setIsProcessing(true);

    try {
      // If user is not authenticated, save the selection and prompt for login or guest checkout
      if (!isAuthenticated) {
        // Store selection in local storage for guest checkout
        const selection = {
          showtimeId: Number(id),
          seats: selectedSeats,
          ticketTypes,
          totalPrice,
          movieTitle: showtime?.movieTitle,
          startTime: showtime?.startTime,
          theaterName: showtime?.theaterName,
          screenName: showtime?.screenName,
        };

        // Store the selection for the next step
        await AsyncStorage.setItem("guestSelection", JSON.stringify(selection));

        // Ask if user wants to create account or continue as guest
        Alert.alert(
          "Continue Booking",
          "Would you like to sign in or continue as a guest?",
          [
            {
              text: "Sign In",
              onPress: () => {
                // Navigate to login with return path
                router.push(`/login?returnTo=/booking/${id}/payment`);
              },
            },
            {
              text: "Continue as Guest",
              onPress: () => {
                // Continue as guest
                router.push(`/booking/${id}/payment`);
              },
            },
          ]
        );
      } else {
        // User is authenticated, create reservation directly
        const tickets: CreateTicketRequest[] = selectedSeats.map((seatId) => ({
          seatId,
          ticketType: ticketTypes[seatId] || "Adult",
        }));

        // Initialize reservation (but don't process payment yet)
        try {
          const reservationRequest = {
            showtimeId: Number(id),
            tickets,
            processPayment: false,
          };

          const reservation = await reservationService.createReservation(
            reservationRequest
          );

          // Continue to payment with reservation ID
          router.push({
            pathname: `./booking/${id}/payment`,
            params: { reservationId: reservation.id.toString() },
          });
        } catch (error) {
          console.error("Failed to create reservation:", error);
          Alert.alert(
            "Error",
            "Failed to create reservation. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("Error processing selection:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Render loading state
  if (isLoading || !seatingLayout || !showtime) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B4D335" />
        <ThemedText style={styles.loadingText}>
          Loading seating layout...
        </ThemedText>
      </ThemedView>
    );
  }

  // Sort row keys alphabetically
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
          {/* Movie and showtime info */}
          <View style={styles.movieInfoContainer}>
            <ThemedText style={styles.movieTitle}>
              {showtime.movieTitle}
            </ThemedText>
            <ThemedText style={styles.showtimeInfo}>
              {new Date(showtime.startTime).toLocaleString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </ThemedText>
            <ThemedText style={styles.theaterInfo}>
              {showtime.theaterName} • {showtime.screenName}
            </ThemedText>
          </View>

          {/* Seat map */}
          <View style={styles.seatMapContainer}>
            <View style={styles.screen}>
              <ThemedText style={styles.screenText}>Screen</ThemedText>
            </View>

            <View style={styles.seatMapContainer}>
              {sortedRowKeys.map((rowKey) => (
                <View key={rowKey} style={styles.row}>
                  <View style={styles.rowLabel}>
                    <ThemedText style={styles.rowLabelText}>
                      {rowKey}
                    </ThemedText>
                  </View>

                  <View style={styles.seats}>
                    {seatingLayout.rows[rowKey].map((seat) => {
                      const isSelected = selectedSeats.includes(seat.id);
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
            </View>

            {/* Legend */}
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

          {/* Selected seats and ticket types */}
          {selectedSeats.length > 0 && (
            <View style={styles.ticketSection}>
              <ThemedText style={styles.sectionTitle}>Ticket Types</ThemedText>

              {selectedSeats.map((seatId) => {
                // Find seat info
                let seatRow = "";
                let seatNumber = 0;

                for (const rowKey in seatingLayout.rows) {
                  const seat = seatingLayout.rows[rowKey].find(
                    (s) => s.id === seatId
                  );
                  if (seat) {
                    seatRow = seat.row;
                    seatNumber = seat.number;
                    break;
                  }
                }

                return (
                  <View key={seatId} style={styles.ticketTypeRow}>
                    <ThemedText style={styles.seatLabel}>
                      Seat {seatRow}
                      {seatNumber}:
                    </ThemedText>

                    <View style={styles.ticketTypeButtons}>
                      <TouchableOpacity
                        style={[
                          styles.typeButton,
                          (ticketTypes[seatId] || "Adult") === "Adult" &&
                            styles.selectedTypeButton,
                        ]}
                        onPress={() => handleTicketTypeChange(seatId, "Adult")}
                      >
                        <ThemedText
                          style={[
                            styles.typeButtonText,
                            (ticketTypes[seatId] || "Adult") === "Adult" &&
                              styles.selectedTypeText,
                          ]}
                        >
                          Adult
                        </ThemedText>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.typeButton,
                          (ticketTypes[seatId] || "Adult") === "Child" &&
                            styles.selectedTypeButton,
                        ]}
                        onPress={() => handleTicketTypeChange(seatId, "Child")}
                      >
                        <ThemedText
                          style={[
                            styles.typeButtonText,
                            (ticketTypes[seatId] || "Adult") === "Child" &&
                              styles.selectedTypeText,
                          ]}
                        >
                          Child
                        </ThemedText>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.typeButton,
                          (ticketTypes[seatId] || "Adult") === "Senior" &&
                            styles.selectedTypeButton,
                        ]}
                        onPress={() => handleTicketTypeChange(seatId, "Senior")}
                      >
                        <ThemedText
                          style={[
                            styles.typeButtonText,
                            (ticketTypes[seatId] || "Adult") === "Senior" &&
                              styles.selectedTypeText,
                          ]}
                        >
                          Senior
                        </ThemedText>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Summary and totals */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>
                Selected Seats:
              </ThemedText>
              <ThemedText style={styles.summaryValue}>
                {selectedSeats.length > 0
                  ? selectedSeats
                      .map((seatId) => {
                        // Find seat info for display
                        for (const rowKey in seatingLayout.rows) {
                          const seat = seatingLayout.rows[rowKey].find(
                            (s) => s.id === seatId
                          );
                          if (seat) {
                            return `${seat.row}${seat.number}`;
                          }
                        }
                        return "";
                      })
                      .join(", ")
                  : "None"}
              </ThemedText>
            </View>

            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Ticket Count:</ThemedText>
              <ThemedText style={styles.summaryValue}>
                {selectedSeats.length}
              </ThemedText>
            </View>

            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>Total:</ThemedText>
              <ThemedText style={styles.totalPrice}>
                ${totalPrice.toFixed(2)}
              </ThemedText>
            </View>
          </View>

          {/* Continue button */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              (selectedSeats.length === 0 || isProcessing) &&
                styles.disabledButton,
            ]}
            onPress={handleContinue}
            disabled={selectedSeats.length === 0 || isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <ThemedText style={styles.continueButtonText}>
                Continue to Payment
              </ThemedText>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* Theme toggle */}
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
