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
  itemsContainer: {
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    paddingLeft: 16,
  },
  itemName: {
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
  },
  deliveryInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  deliveryLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  deliveryValue: {
    fontSize: 16,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalValue: {
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
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../components/AuthProvider";
import { useTheme } from "../../components/ThemeProvider";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { ThemeToggle } from "../../components/ThemeToggle";

import * as concessionService from "../../services/concessions/concessionsService";

export default function FoodPaymentScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [deliveryType, setDeliveryType] = useState<"Pickup" | "ToSeat">(
    "Pickup"
  );
  const [paymentMethod, setPaymentMethod] = useState("visa");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const loadCartData = async () => {
      setIsLoading(true);
      try {
        const cartData = await AsyncStorage.getItem("foodCart");
        const deliveryOption = await AsyncStorage.getItem("foodDeliveryType");

        if (cartData) {
          const items = JSON.parse(cartData);
          setCartItems(items);

          const total = items.reduce(
            (sum: number, item: any) => sum + item.price * item.quantity,
            0
          );
          setTotalAmount(total);
        }

        if (deliveryOption === "ToSeat" || deliveryOption === "Pickup") {
          setDeliveryType(deliveryOption);
        }
      } catch (error) {
        console.error("Error loading cart data:", error);
        Alert.alert(
          "Error",
          "Could not load your order details. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadCartData();
  }, []);

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      Alert.alert(
        "Empty Cart",
        "Your cart is empty. Please add items before checking out."
      );
      return;
    }

    setIsProcessing(true);

    try {
      const orderItems = cartItems.map((item) => ({
        foodItemId: item.foodItemId,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions || "",
      }));

      const orderRequest = {
        deliveryType: deliveryType,
        orderItems: orderItems,
      };

      if (isAuthenticated && user) {
        const order = await concessionService.createFoodOrder(orderRequest);

        await AsyncStorage.removeItem("foodCart");
        await AsyncStorage.removeItem("foodDeliveryType");

        router.push({
          pathname: "../food-checkout/confirmation",
          params: { orderId: order.id.toString() },
        });
      } else {
        const guestOrderId = new Date().getTime();
        const guestOrder = {
          id: guestOrderId,
          orderTime: new Date().toISOString(),
          status: "Pending",
          deliveryType: deliveryType,
          totalAmount: totalAmount,
          items: cartItems,
        };

        const guestOrdersStr = await AsyncStorage.getItem("guestFoodOrders");
        const guestOrders = guestOrdersStr ? JSON.parse(guestOrdersStr) : [];

        guestOrders.push(guestOrder);
        await AsyncStorage.setItem(
          "guestFoodOrders",
          JSON.stringify(guestOrders)
        );

        await AsyncStorage.removeItem("foodCart");
        await AsyncStorage.removeItem("foodDeliveryType");

        setTimeout(() => {
          setIsProcessing(false);

          router.push({
            pathname: "../food-checkout/confirmation",
            params: { orderId: guestOrderId.toString(), guest: "true" },
          });
        }, 1500);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setIsProcessing(false);
      Alert.alert(
        "Payment Failed",
        "There was a problem processing your payment. Please try again."
      );
    }
  };

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
          <View style={styles.summaryContainer}>
            <ThemedText style={styles.sectionTitle}>Order Summary</ThemedText>

            <View style={styles.itemsContainer}>
              <ThemedText style={styles.summaryLabel}>Items:</ThemedText>
              {cartItems.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <ThemedText style={styles.itemName}>
                    {item.quantity}x {item.foodItemName}
                  </ThemedText>
                  <ThemedText style={styles.itemPrice}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </ThemedText>
                </View>
              ))}
            </View>

            <View style={styles.deliveryInfo}>
              <ThemedText style={styles.deliveryLabel}>Delivery:</ThemedText>
              <ThemedText style={styles.deliveryValue}>
                {deliveryType === "ToSeat"
                  ? "To your seat"
                  : "Pickup at counter"}
              </ThemedText>
            </View>

            <View style={styles.totalContainer}>
              <ThemedText style={styles.totalLabel}>Total:</ThemedText>
              <ThemedText style={styles.totalValue}>
                ${totalAmount.toFixed(2)}
              </ThemedText>
            </View>
          </View>

          <View style={styles.paymentMethodsContainer}>
            <ThemedText style={styles.sectionTitle}>Payment Method</ThemedText>

            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethodItem,
                  paymentMethod === method.id && styles.selectedPaymentMethod,
                ]}
                onPress={() => setPaymentMethod(method.id)}
              >
                <Ionicons
                  name={method.icon as any}
                  size={24}
                  color={
                    paymentMethod === method.id
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
                    paymentMethod === method.id && styles.selectedPaymentLabel,
                  ]}
                >
                  {method.label}
                </ThemedText>
                <View style={styles.radioButton}>
                  {paymentMethod === method.id && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

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

        <ThemeToggle position="bottomRight" size={40} />
      </ThemedView>
    </>
  );
}
