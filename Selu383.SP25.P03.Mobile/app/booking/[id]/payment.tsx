import React, { useState, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../../components/AuthProvider";
import { useTheme } from "../../../components/ThemeProvider";
import { ThemedView } from "../../../components/ThemedView";
import { ThemedText } from "../../../components/ThemedText";
import { ThemeToggle } from "../../../components/ThemeToggle";

import * as reservationService from "../../../services/reservations/reservationService";
import * as movieService from "../../../services/movies/movieService";
import * as concessionService from "../../../services/concessions/concessionsService";

export default function PaymentScreen() {
  const { id, reservationId, guest } = useLocalSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  // State variables
  const [reservation, setReservation] = useState<any>(null);
  const [guestSelection, setGuestSelection] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("visa");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showtime, setShowtime] = useState<any>(null);
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [foodTotal, setFoodTotal] = useState(0);
  const [foodDeliveryType, setFoodDeliveryType] = useState<string>("");

  useEffect(() => {
    loadData();
  }, [reservationId, id]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Check if we're loading for a guest
      if (guest === "true") {
        // Find the guest ticket in AsyncStorage
        const guestTicketsStr = await AsyncStorage.getItem("guestTickets");
        if (guestTicketsStr) {
          const guestTickets = JSON.parse(guestTicketsStr);
          const foundTicket = guestTickets.find(
            (ticket: any) => ticket.reservationId === Number(reservationId)
          );

          if (foundTicket) {
            setReservation(foundTicket);
            setTotalAmount(foundTicket.totalAmount);
          }
        }
      } else if (reservationId) {
        // Load authenticated user reservation
        const reservationData = await reservationService.getReservation(
          Number(reservationId)
        );
        setReservation(reservationData);
        setTotalAmount(reservationData.totalAmount);

        // Load showtime data
        const showtimeData = await movieService.getShowtime(Number(id));
        setShowtime(showtimeData);
      } else {
        // Load guest selection from local storage
        const guestSelectionData = await AsyncStorage.getItem("guestSelection");
        if (guestSelectionData) {
          const parsedData = JSON.parse(guestSelectionData);
          setGuestSelection(parsedData);
          setTotalAmount(parsedData.totalPrice);

          // Load showtime data
          const showtimeData = await movieService.getShowtime(Number(id));
          setShowtime(showtimeData);
        } else {
          // No selection data
          Alert.alert("Error", "No booking information found.", [
            { text: "OK", onPress: () => router.back() },
          ]);
        }
      }

      // Check if we have food items to add
      const foodOrderItemsStr = await AsyncStorage.getItem("foodOrderItems");
      if (foodOrderItemsStr) {
        const foodOrderData = JSON.parse(foodOrderItemsStr);
        setFoodItems(foodOrderData.items);
        setFoodTotal(foodOrderData.total);
        setFoodDeliveryType(foodOrderData.deliveryType);

        // Add food total to the overall total
        setTotalAmount((prevTotal) => prevTotal + foodOrderData.total);
      }
    } catch (error) {
      console.error("Failed to load payment data:", error);
      Alert.alert("Error", "Failed to load booking details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing with a delay
    setTimeout(async () => {
      try {
        if (isAuthenticated && reservation) {
          // For authenticated users with a reservation
          await reservationService.payForReservation(reservation.id);

          // Create food order if items exist
          if (foodItems && foodItems.length > 0) {
            try {
              const validDeliveryTypes: ("Pickup" | "ToSeat")[] = ["Pickup", "ToSeat"];
              const foodOrderRequest = {
                orderItems: foodItems,
                deliveryType: validDeliveryTypes.includes(foodDeliveryType as any)
                  ? (foodDeliveryType as "Pickup" | "ToSeat")
                  : "Pickup", // Default to "Pickup" if invalid
                reservationId: reservation.id,
              };

              await concessionService.createFoodOrder(foodOrderRequest);

              // Clear food items from storage
              await AsyncStorage.removeItem("foodOrderItems");
            } catch (foodError) {
              console.error("Error creating food order:", foodError);
              // Continue with payment even if food order fails
            }
          }

          // Navigate to confirmation
          router.push({
            pathname: `./booking/${id}/confirmation`,
            params: { reservationId: reservation.id.toString() },
          });
        } else if (guestSelection) {
          // For guest users
          // Create a temporary reservation object for the guest
          const guestReservation: {
            id: number;
            movieTitle: any;
            theaterName: any;
            screenName: any;
            showtimeStartTime: any;
            showtimeId: number;
            totalAmount: any;
            isPaid: boolean;
            reservationTime: string;
            tickets: any;
            foodItems?: any[];
            foodTotal?: number;
            foodDeliveryType?: string;
          } = {
            id: new Date().getTime(), // Use timestamp as ID
            movieTitle: showtime?.movieTitle || guestSelection.movieTitle,
            theaterName: showtime?.theaterName || guestSelection.theaterName,
            screenName: showtime?.screenName || guestSelection.screenName,
            showtimeStartTime: showtime?.startTime || guestSelection.startTime,
            showtimeId: Number(id),
            totalAmount: guestSelection.totalPrice,
            isPaid: true,
            reservationTime: new Date().toISOString(),
            tickets: guestSelection.seats.map((seatId: number) => ({
              id: seatId,
              seatId: seatId,
              row: String.fromCharCode(65 + Math.floor(Math.random() * 8)), // Random row A-H
              number: Math.floor(Math.random() * 20) + 1, // Random seat number 1-20
              ticketType: guestSelection.ticketTypes[seatId] || "Adult",
              price: guestSelection.totalPrice / guestSelection.seats.length,
            })),
          };

          // Add food items to the guest reservation if they exist
          if (foodItems && foodItems.length > 0) {
            guestReservation.foodItems = foodItems;
            guestReservation.foodTotal = foodTotal;
            guestReservation.foodDeliveryType = foodDeliveryType;
            guestReservation.totalAmount += foodTotal;

            // Clear food items from storage
            await AsyncStorage.removeItem("foodOrderItems");
          }

          // Store guest ticket for future reference
          const existingTicketsStr = await AsyncStorage.getItem("guestTickets");
          const guestTickets = existingTicketsStr
            ? JSON.parse(existingTicketsStr)
            : [];

          guestTickets.push({
            reservationId: guestReservation.id,
            movieTitle: guestReservation.movieTitle,
            theaterName: guestReservation.theaterName,
            screenName: guestReservation.screenName,
            showtimeStartTime: guestReservation.showtimeStartTime,
            totalAmount: guestReservation.totalAmount,
            tickets: guestReservation.tickets,
            foodItems: guestReservation.foodItems,
            foodTotal: guestReservation.foodTotal,
            foodDeliveryType: guestReservation.foodDeliveryType,
            purchaseDate: new Date().toISOString(),
          });

          await AsyncStorage.setItem(
            "guestTickets",
            JSON.stringify(guestTickets)
          );

          // Clear the selection
          await AsyncStorage.removeItem("guestSelection");

          // Navigate to confirmation
          router.push({
            pathname: `./booking/${id}/confirmation`,
            params: {
              reservationId: guestReservation.id.toString(),
              guest: "true",
            },
          });
        }
      } catch (error) {
        console.error("Payment error:", error);
        Alert.alert(
          "Payment Failed",
          "There was an error processing your payment."
        );
        setIsProcessing(false);
      }
    }, 1500); // 1.5 second delay to simulate processing
  };

  // Render loading state
  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B4D335" />
        <ThemedText style={styles.loadingText}>
          Loading payment details...
        </ThemedText>
      </ThemedView>
    );
  }

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
                {reservation?.movieTitle ||
                  showtime?.movieTitle ||
                  guestSelection?.movieTitle}
              </ThemedText>

              <ThemedText style={styles.theaterInfo}>
                {reservation?.theaterName ||
                  showtime?.theaterName ||
                  guestSelection?.theaterName}{" "}
                •{" "}
                {reservation?.screenName ||
                  showtime?.screenName ||
                  guestSelection?.screenName}
              </ThemedText>

              <ThemedText style={styles.showtime}>
                {new Date(
                  reservation?.showtimeStartTime ||
                    showtime?.startTime ||
                    guestSelection?.startTime
                ).toLocaleString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </ThemedText>

              <View style={styles.ticketsContainer}>
                <ThemedText style={styles.ticketsLabel}>Tickets:</ThemedText>
                {reservation?.tickets ? (
                  reservation.tickets.map((ticket: any, index: number) => (
                    <ThemedText key={index} style={styles.ticketItem}>
                      {ticket.ticketType} - Seat {ticket.row}
                      {ticket.number} (${ticket.price.toFixed(2)})
                    </ThemedText>
                  ))
                ) : guestSelection?.seats ? (
                  guestSelection.seats.map((seatId: number, index: number) => {
                    const ticketType =
                      guestSelection.ticketTypes[seatId] || "Adult";
                    const price =
                      guestSelection.totalPrice / guestSelection.seats.length;
                    return (
                      <ThemedText key={index} style={styles.ticketItem}>
                        {ticketType} - Seat {index + 1} (${price.toFixed(2)})
                      </ThemedText>
                    );
                  })
                ) : (
                  <ThemedText style={styles.ticketItem}>
                    No tickets found
                  </ThemedText>
                )}
              </View>

              <View style={styles.totalRow}>
                <ThemedText style={styles.totalLabel}>Total:</ThemedText>
                <ThemedText style={styles.totalPrice}>
                  ${totalAmount.toFixed(2)}
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
                  selectedPaymentMethod === method.id &&
                    styles.selectedPaymentMethod,
                ]}
                onPress={() => setSelectedPaymentMethod(method.id)}
              >
                <Ionicons
                  name={method.icon as any}
                  size={24}
                  color={
                    selectedPaymentMethod === method.id
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
                    selectedPaymentMethod === method.id &&
                      styles.selectedPaymentLabel,
                  ]}
                >
                  {method.label}
                </ThemedText>
                <View style={styles.radioButton}>
                  {selectedPaymentMethod === method.id && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Add new card form (conditionally rendered) */}
          {selectedPaymentMethod === "new-card" && (
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
            style={[styles.payButton, isProcessing && styles.disabledButton]}
            onPress={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#242424" />
            ) : (
              <ThemedText style={styles.payButtonText}>
                Pay ${totalAmount.toFixed(2)}
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
});
