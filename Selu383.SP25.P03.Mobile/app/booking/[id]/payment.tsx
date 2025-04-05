import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  TextInput,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../../components/AuthProvider";
import { useTheme } from "../../../components/ThemeProvider";

import { ThemedView } from "../../../components/ThemedView";
import { ThemedText } from "../../../components/ThemedText";

import * as reservationService from "../../../services/reservations/reservationService";

import { ReservationResponse } from "../../../types/api/reservations";
import { paymentScreenStyles as styles } from "../../../styles/screens/paymentScreen";

// Payment method type definition
type PaymentMethod = {
  id: string;
  label: string;
  cardNumber?: string;
  icon: string;
  isDefault?: boolean;
};

export default function PaymentScreen() {
  const { id, reservationId } = useLocalSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();

  // State variables
  const [reservation, setReservation] = useState<ReservationResponse | null>(
    null
  );
  const [guestSelection, setGuestSelection] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");

  // Sample payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: "visa",
      label: "Visa ending in 4242",
      cardNumber: "•••• •••• •••• 4242",
      icon: "card",
      isDefault: true,
    },
    {
      id: "mastercard",
      label: "Mastercard ending in 5555",
      cardNumber: "•••• •••• •••• 5555",
      icon: "card",
    },
    {
      id: "applepay",
      label: "Apple Pay",
      icon: "logo-apple",
    },
    {
      id: "googlepay",
      label: "Google Pay",
      icon: "logo-google",
    },
    {
      id: "new-card",
      label: "Add new payment method",
      icon: "add-circle-outline",
    },
  ];

  useEffect(() => {
    loadData();
  }, [id, reservationId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // If we have a reservation ID, fetch it
      if (reservationId) {
        const reservationData = await reservationService.getReservation(
          Number(reservationId)
        );
        setReservation(reservationData);
        setSelectedPaymentMethod(paymentMethods[0].id); // Set default payment method
      } else {
        // Otherwise, load guest selection from AsyncStorage
        const selectionData = await AsyncStorage.getItem("guestSelection");
        if (selectionData) {
          setGuestSelection(JSON.parse(selectionData));
          setSelectedPaymentMethod(paymentMethods[0].id); // Set default payment method
        } else {
          // No selection data found
          Alert.alert(
            "Error",
            "No booking information found. Please try again.",
            [
              {
                text: "OK",
                onPress: () => router.back(),
              },
            ]
          );
        }
      }
    } catch (error) {
      console.error("Failed to load data:", error);
      Alert.alert(
        "Error",
        "Failed to load booking information. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);

    // Clear form if adding new card
    if (methodId === "new-card") {
      setCardNumber("");
      setExpiryDate("");
      setCvv("");
      setNameOnCard("");
    }
  };

  // Format card number input with spaces
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const chunks = [];

    for (let i = 0; i < cleaned.length; i += 4) {
      chunks.push(cleaned.substring(i, i + 4));
    }

    return chunks.join(" ").trim();
  };

  // Format expiry date input with slash
  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, "");

    if (cleaned.length >= 3) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    } else if (cleaned.length === 2) {
      return `${cleaned}/`;
    }

    return cleaned;
  };

  const handlePayment = async () => {
    // Validate new card details if selected
    if (selectedPaymentMethod === "new-card") {
      if (!cardNumber || cardNumber.replace(/\s+/g, "").length < 16) {
        Alert.alert("Invalid Card", "Please enter a valid card number.");
        return;
      }

      if (!expiryDate || expiryDate.length < 5) {
        Alert.alert(
          "Invalid Expiry Date",
          "Please enter a valid expiry date (MM/YY)."
        );
        return;
      }

      if (!cvv || cvv.length < 3) {
        Alert.alert("Invalid CVV", "Please enter a valid CVV code.");
        return;
      }

      if (!nameOnCard) {
        Alert.alert("Invalid Name", "Please enter the name on card.");
        return;
      }
    }

    setIsProcessing(true);

    try {
      // For authenticated users with existing reservation
      if (reservation) {
        // Mark reservation as paid
        await reservationService.payForReservation(reservation.id);

        // Navigate to confirmation screen
        router.push({
          pathname: "/booking/[id]/confirmation",
          params: {
            id: id?.toString() || "",
            reservationId: reservation.id.toString(),
          },
        });
      }
      // For guest users
      else if (guestSelection) {
        // Create a reservation and mark as paid immediately
        const tickets = guestSelection.seats.map((seatId: number) => ({
          seatId,
          ticketType: guestSelection.ticketTypes[seatId] || "Adult",
        }));

        const reservationRequest = {
          showtimeId: guestSelection.showtimeId,
          tickets,
          processPayment: true, // Process payment immediately
        };

        const newReservation = await reservationService.createReservation(
          reservationRequest
        );

        // Save ticket info for guest users
        const guestTicketInfo = {
          reservationId: newReservation.id,
          movieTitle: newReservation.movieTitle,
          theaterName: newReservation.theaterName,
          screenName: newReservation.screenName,
          showtimeStartTime: newReservation.showtimeStartTime,
          totalAmount: newReservation.totalAmount,
          tickets: newReservation.tickets,
          purchaseDate: new Date().toISOString(),
        };

        // Store guest ticket info
        const existingTicketsStr = await AsyncStorage.getItem("guestTickets");
        let guestTickets = existingTicketsStr
          ? JSON.parse(existingTicketsStr)
          : [];
        guestTickets.push(guestTicketInfo);
        await AsyncStorage.setItem(
          "guestTickets",
          JSON.stringify(guestTickets)
        );

        // Clean up guest selection
        await AsyncStorage.removeItem("guestSelection");

        // Navigate to confirmation screen
        router.push({
            pathname: "/booking/[id]/confirmation",
            params: { id: guestSelection.showtimeId.toString(), reservationId: newReservation.id.toString() }
          });
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      Alert.alert(
        "Payment Failed",
        "There was an error processing your payment. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
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

  return (
    <>
      <Stack.Screen
        options={{
          title: "Payment",
          headerStyle: {
            backgroundColor: "#1E2429",
          },
          headerTitleStyle: {
            color: "#FFFFFF",
          },
          headerTintColor: "#B4D335",
        }}
      />

      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Order summary */}
          <View style={styles.summaryContainer}>
            <ThemedText style={styles.sectionTitle}>Order Summary</ThemedText>

            <View style={styles.summaryContent}>
              <ThemedText style={styles.movieTitle}>
                {reservation?.movieTitle || guestSelection?.movieTitle}
              </ThemedText>

              <ThemedText style={styles.theaterInfo}>
                {reservation?.theaterName || guestSelection?.theaterName} •{" "}
                {reservation?.screenName || guestSelection?.screenName}
              </ThemedText>

              <ThemedText style={styles.showtime}>
                {new Date(
                  reservation?.showtimeStartTime || guestSelection?.startTime
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
                {reservation?.tickets
                  ? reservation.tickets.map((ticket, index) => (
                      <ThemedText key={index} style={styles.ticketItem}>
                        {ticket.ticketType} - Seat {ticket.row}
                        {ticket.number} (${ticket.price.toFixed(2)})
                      </ThemedText>
                    ))
                  : guestSelection?.seats.map(
                      (seatId: number, index: number) => {
                        const ticketType =
                          guestSelection.ticketTypes[seatId] || "Adult";
                        // Normally we'd have seat row/number info here, but in this simplified version
                        // we'll just show seat IDs
                        return (
                          <ThemedText key={index} style={styles.ticketItem}>
                            {ticketType} - Seat ID: {seatId}
                          </ThemedText>
                        );
                      }
                    )}
              </View>

              <View style={styles.totalContainer}>
                <ThemedText style={styles.totalLabel}>Total:</ThemedText>
                <ThemedText style={styles.totalValue}>
                  $
                  {(
                    reservation?.totalAmount ||
                    guestSelection?.totalPrice ||
                    0
                  ).toFixed(2)}
                </ThemedText>
              </View>
            </View>
          </View>

          {/* Payment methods */}
          <View style={styles.paymentContainer}>
            <ThemedText style={styles.sectionTitle}>Payment Method</ThemedText>

            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethod,
                  selectedPaymentMethod === method.id &&
                    styles.selectedPaymentMethod,
                ]}
                onPress={() => handlePaymentMethodSelect(method.id)}
              >
                <View style={styles.paymentMethodIcon}>
                  <Ionicons
                    name={method.icon as any}
                    size={24}
                    color="#B4D335"
                  />
                </View>

                <View style={styles.paymentMethodDetails}>
                  <ThemedText style={styles.paymentMethodLabel}>
                    {method.label}
                    {method.isDefault && (
                      <ThemedText style={styles.defaultLabel}>
                        {" "}
                        (Default)
                      </ThemedText>
                    )}
                  </ThemedText>

                  {method.cardNumber && (
                    <ThemedText style={styles.cardNumber}>
                      {method.cardNumber}
                    </ThemedText>
                  )}
                </View>

                <View style={styles.paymentMethodCheck}>
                  {selectedPaymentMethod === method.id && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#B4D335"
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}

            {/* New card form */}
            {selectedPaymentMethod === "new-card" && (
              <View style={styles.newCardForm}>
                <View style={styles.inputGroup}>
                  <ThemedText style={styles.inputLabel}>Card Number</ThemedText>
                  <TextInput
                    style={styles.input}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor="#9BA1A6"
                    value={cardNumber}
                    onChangeText={(text) =>
                      setCardNumber(formatCardNumber(text))
                    }
                    keyboardType="numeric"
                    maxLength={19} // 16 digits + 3 spaces
                  />
                </View>

                <View style={styles.rowInputs}>
                  <View style={[styles.inputGroup, styles.halfInput]}>
                    <ThemedText style={styles.inputLabel}>
                      Expiry Date
                    </ThemedText>
                    <TextInput
                      style={styles.input}
                      placeholder="MM/YY"
                      placeholderTextColor="#9BA1A6"
                      value={expiryDate}
                      onChangeText={(text) =>
                        setExpiryDate(formatExpiryDate(text))
                      }
                      keyboardType="numeric"
                      maxLength={5} // MM/YY
                    />
                  </View>

                  <View style={[styles.inputGroup, styles.halfInput]}>
                    <ThemedText style={styles.inputLabel}>CVV</ThemedText>
                    <TextInput
                      style={styles.input}
                      placeholder="123"
                      placeholderTextColor="#9BA1A6"
                      value={cvv}
                      onChangeText={(text) => setCvv(text.replace(/\D/g, ""))}
                      keyboardType="numeric"
                      maxLength={4}
                      secureTextEntry
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <ThemedText style={styles.inputLabel}>
                    Name on Card
                  </ThemedText>
                  <TextInput
                    style={styles.input}
                    placeholder="John Doe"
                    placeholderTextColor="#9BA1A6"
                    value={nameOnCard}
                    onChangeText={setNameOnCard}
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.saveCardContainer}>
                  <Ionicons name="checkbox-outline" size={24} color="#B4D335" />
                  <ThemedText style={styles.saveCardText}>
                    Save card for future purchases
                  </ThemedText>
                </View>
              </View>
            )}
          </View>

          {/* Billing Address section would go here in a real app */}

          {/* Payment button */}
          <TouchableOpacity
            style={[styles.payButton, isProcessing && styles.disabledButton]}
            onPress={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <ThemedText style={styles.payButtonText}>
                  Pay $
                  {(
                    reservation?.totalAmount ||
                    guestSelection?.totalPrice ||
                    0
                  ).toFixed(2)}
                </ThemedText>
                <Ionicons
                  name="lock-closed"
                  size={16}
                  color="#FFFFFF"
                  style={styles.secureIcon}
                />
              </>
            )}
          </TouchableOpacity>

          <ThemedText style={styles.secureNote}>
            Your payment information is secure and encrypted
          </ThemedText>
        </ScrollView>
      </ThemedView>
    </>
  );
}
