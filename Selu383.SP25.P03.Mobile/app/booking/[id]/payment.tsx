import React, { useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextInput,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../components/AuthProvider";
import { useTheme } from "../../../components/ThemeProvider";
import { ThemedView } from "../../../components/ThemedView";
import { ThemedText } from "../../../components/ThemedText";
import { ThemeToggle } from "../../../components/ThemeToggle";
import { useBooking } from "../../../components/BookingProvider";

export default function PaymentScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";
  const booking = useBooking();

  // Ensure we have booking data
  useEffect(() => {
    const checkBookingData = async () => {
      if (!booking.showtime) {
        // If no booking data, try to load from progress
        const loaded = await booking.loadBookingProgress();

        // If still no data, redirect to seat selection
        if (!loaded) {
          router.replace(`/booking/${id}/seats`);
        }
      }

      // If we have a reservation ID but don't have the reservation data, load it
      if (booking.reservationId && !booking.reservation) {
        await booking.loadReservation(booking.reservationId);
      }
    };

    checkBookingData();
  }, [id]);

  const handlePayment = async () => {
    try {
      // Process payment
      const success = await booking.processPayment();

      if (success) {
        if (booking.isGuest) {
          // For guest users
          if (booking.showtime) {
            const result = await booking.completeGuestBooking(booking.showtime);

            router.push({
              pathname: `./booking/${id}/confirmation`,
              params: {
                reservationId: result.reservationId.toString(),
                guest: "true",
              },
            });
          } else {
            Alert.alert("Error", "Missing showtime information");
          }
        } else {
          // For authenticated users
          router.push({
            pathname: `./booking/${id}/confirmation`,
            params: { reservationId: booking.reservationId!.toString() },
          });
        }

        // Reset booking state after navigating to confirmation
        booking.resetBooking();
      } else {
        Alert.alert(
          "Payment Failed",
          "There was a problem processing your payment. Please try again."
        );
      }
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert(
        "Payment Error",
        "There was a problem with your payment. Please try again later."
      );
    }
  };

  // Payment methods data
  const paymentMethods = [
    { id: "visa", label: "Visa ending in 4242", icon: "card" },
    { id: "mastercard", label: "Mastercard ending in 5555", icon: "card" },
    { id: "applepay", label: "Apple Pay", icon: "logo-apple" },
    { id: "googlepay", label: "Google Pay", icon: "logo-google" },
    {
      id: "new-card",
      label: "Add new payment method",
      icon: "add-circle-outline",
    },
  ];

  // Loading state
  if (booking.isLoading || !booking.showtime) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B4D335" />
        <ThemedText style={styles.loadingText}>
          Loading payment details...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Payment",
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
          {/* Order summary */}
          <View style={styles.summaryContainer}>
            <ThemedText style={styles.sectionTitle}>Order Summary</ThemedText>

            <View style={styles.summaryContent}>
              <ThemedText style={styles.movieTitle}>
                {booking.showtime.movieTitle}
              </ThemedText>

              <ThemedText style={styles.theaterInfo}>
                {booking.showtime.theaterName} • {booking.showtime.screenName}
              </ThemedText>

              <ThemedText style={styles.showtime}>
                {new Date(booking.showtime.startTime).toLocaleString(
                  undefined,
                  {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </ThemedText>

              <View style={styles.ticketsContainer}>
                <ThemedText style={styles.ticketsLabel}>Tickets:</ThemedText>
                {booking.selectedSeats.map((seatId, index) => {
                  // Get seat details - row and number
                  let seatRow = "";
                  let seatNumber = 0;

                  if (booking.seatingLayout) {
                    for (const rowKey in booking.seatingLayout.rows) {
                      const seat = booking.seatingLayout.rows[rowKey].find(
                        (s) => s.id === seatId
                      );
                      if (seat) {
                        seatRow = seat.row;
                        seatNumber = seat.number;
                        break;
                      }
                    }
                  }

                  const ticketType = booking.ticketTypes[seatId] || "Adult";
                  let price = booking.showtime
                    ? booking.showtime.ticketPrice
                    : 0;

                  // Apply discount based on ticket type
                  if (ticketType === "Child") price *= 0.75; // 25% off
                  if (ticketType === "Senior") price *= 0.8; // 20% off

                  return (
                    <ThemedText key={index} style={styles.ticketItem}>
                      {ticketType} - Seat {seatRow}
                      {seatNumber} (${price.toFixed(2)})
                    </ThemedText>
                  );
                })}
              </View>

              {/* Show food items if any */}
              {booking.foodItems.length > 0 && (
                <View style={styles.foodContainer}>
                  <ThemedText style={styles.ticketsLabel}>
                    Food Items:
                  </ThemedText>
                  {booking.foodItems.map((item, index) => (
                    <ThemedText key={index} style={styles.ticketItem}>
                      {item.quantity}x {item.foodItemName} ($
                      {(item.price * item.quantity).toFixed(2)})
                    </ThemedText>
                  ))}
                </View>
              )}

              <View style={styles.totalRow}>
                <ThemedText style={styles.totalLabel}>Total:</ThemedText>
                <ThemedText style={styles.totalPrice}>
                  ${booking.totalAmount.toFixed(2)}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Payment methods */}
          <View style={styles.paymentMethodsContainer}>
            <ThemedText style={styles.sectionTitle}>Payment Method</ThemedText>

            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethodItem,
                  booking.paymentMethod === method.id &&
                    styles.selectedPaymentMethod,
                ]}
                onPress={() => booking.setPaymentMethod(method.id)}
              >
                <Ionicons
                  name={method.icon as any}
                  size={24}
                  color={
                    booking.paymentMethod === method.id
                      ? "#B4D335"
                      : isDark
                      ? "#FFFFFF"
                      : "#242424"
                  }
                  style={styles.paymentIcon}
                />
                <ThemedText
                  style={[
                    styles.paymentLabel,
                    booking.paymentMethod === method.id &&
                      styles.selectedPaymentLabel,
                  ]}
                >
                  {method.label}
                </ThemedText>
                <View style={styles.radioButton}>
                  {booking.paymentMethod === method.id && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Add new card form (conditionally rendered) */}
          {booking.paymentMethod === "new-card" && (
            <View style={styles.newCardContainer}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Card Number</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    { color: isDark ? "#FFFFFF" : "#242424" },
                  ]}
                  placeholder="4242 4242 4242 4242"
                  placeholderTextColor={isDark ? "#666666" : "#999999"}
                  keyboardType="number-pad"
                  maxLength={19}
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <ThemedText style={styles.inputLabel}>Expiration</ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      { color: isDark ? "#FFFFFF" : "#242424" },
                    ]}
                    placeholder="MM/YY"
                    placeholderTextColor={isDark ? "#666666" : "#999999"}
                    keyboardType="number-pad"
                    maxLength={5}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <ThemedText style={styles.inputLabel}>CVV</ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      { color: isDark ? "#FFFFFF" : "#242424" },
                    ]}
                    placeholder="123"
                    placeholderTextColor={isDark ? "#666666" : "#999999"}
                    keyboardType="number-pad"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Name on Card</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    { color: isDark ? "#FFFFFF" : "#242424" },
                  ]}
                  placeholder="John Doe"
                  placeholderTextColor={isDark ? "#666666" : "#999999"}
                />
              </View>
            </View>
          )}

          {/* Pay button */}
          <TouchableOpacity
            style={[
              styles.payButton,
              booking.isLoading && styles.disabledButton,
            ]}
            onPress={handlePayment}
            disabled={booking.isLoading}
          >
            {booking.isLoading ? (
              <ActivityIndicator size="small" color="#242424" />
            ) : (
              <ThemedText style={styles.payButtonText}>
                Pay ${booking.totalAmount.toFixed(2)}
              </ThemedText>
            )}
          </TouchableOpacity>

          <ThemedText style={styles.secureText}>
            <Ionicons name="lock-closed" size={14} color="#B4D335" /> All
            payments are secure and encrypted
          </ThemedText>
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
  summaryContainer: {
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
  summaryContent: {
    paddingTop: 8,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  theaterInfo: {
    fontSize: 16,
    marginBottom: 4,
  },
  showtime: {
    fontSize: 16,
    color: "#B4D335",
    marginBottom: 16,
  },
  ticketsContainer: {
    marginBottom: 16,
  },
  ticketsLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  ticketItem: {
    fontSize: 14,
    marginBottom: 4,
    paddingLeft: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    paddingTop: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#B4D335",
  },
  paymentMethodsContainer: {
    backgroundColor: "#262D33",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  paymentMethodItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  selectedPaymentMethod: {
    backgroundColor: "rgba(180, 211, 53, 0.1)",
  },
  paymentIcon: {
    marginRight: 12,
  },
  paymentLabel: {
    fontSize: 16,
    flex: 1,
  },
  selectedPaymentLabel: {
    fontWeight: "bold",
    color: "#B4D335",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#B4D335",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#B4D335",
  },
  newCardContainer: {
    backgroundColor: "#262D33",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  inputRow: {
    flexDirection: "row",
  },
  payButton: {
    backgroundColor: "#B4D335",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
  payButtonText: {
    color: "#1E2429",
    fontSize: 18,
    fontWeight: "bold",
  },
  secureText: {
    textAlign: "center",
    fontSize: 14,
    color: "#9BA1A6",
    marginBottom: 20,
  },
  foodContainer: {
    marginBottom: 16,
  },
});
