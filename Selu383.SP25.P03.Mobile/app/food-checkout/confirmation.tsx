import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../components/AuthProvider";
import { useTheme } from "../../components/ThemeProvider";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { ThemeToggle } from "../../components/ThemeToggle";

import * as concessionService from "../../services/concessions/concessionsService";

export default function FoodConfirmationScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  const orderId = params.orderId as string;
  const isGuest = params.guest === "true";

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrderData = async () => {
      setIsLoading(true);
      try {
        if (!orderId) {
          Alert.alert("Error", "Order information is missing");
          router.push("/(tabs)");
          return;
        }

        if (isGuest) {
          const guestOrdersStr = await AsyncStorage.getItem("guestFoodOrders");
          if (guestOrdersStr) {
            const guestOrders = JSON.parse(guestOrdersStr);
            const foundOrder = guestOrders.find(
              (o: any) => o.id.toString() === orderId
            );

            if (foundOrder) {
              setOrder(foundOrder);
            } else {
              Alert.alert("Error", "Order not found");
              router.push("/(tabs)");
            }
          }
        } else if (isAuthenticated) {
          const orderData = await concessionService.getFoodOrder(
            Number(orderId)
          );
          setOrder(orderData);
        } else {
          Alert.alert("Error", "Authentication required to view this order");
          router.push("/(tabs)");
        }
      } catch (error) {
        console.error("Error loading order:", error);
        Alert.alert("Error", "Failed to load order information");
      } finally {
        setIsLoading(false);
      }
    };

    loadOrderData();
  }, [orderId, isGuest, isAuthenticated]);

  const handleContinueShopping = () => {
    router.push("/(tabs)");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B4D335" />
        <ThemedText style={styles.loadingText}>
          Loading order details...
        </ThemedText>
      </ThemedView>
    );
  }

  if (!order) {
    return (
      <ThemedView style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#E74C3C" />
        <ThemedText style={styles.errorText}>
          Order information not found
        </ThemedText>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={handleContinueShopping}
        >
          <ThemedText style={styles.homeButtonText}>Back to Home</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Order Confirmation",
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
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#B4D335" />
            <ThemedText style={styles.successTitle}>
              Order Confirmed!
            </ThemedText>
            <ThemedText style={styles.successMessage}>
              Your food order has been placed successfully.
            </ThemedText>
          </View>

          <View style={styles.orderContainer}>
            <View style={styles.orderHeader}>
              <ThemedText style={styles.orderTitle}>Order Details</ThemedText>
              <ThemedText style={styles.orderNumber}>#{order.id}</ThemedText>
            </View>

            <View style={styles.orderContent}>
              <ThemedText style={styles.orderDate}>
                {formatDate(order.orderTime)}
              </ThemedText>

              <View style={styles.orderStatusContainer}>
                <ThemedText style={styles.orderStatusLabel}>Status:</ThemedText>
                <View style={styles.orderStatusBadge}>
                  <ThemedText style={styles.orderStatusText}>
                    {order.status || "Pending"}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.deliveryContainer}>
                <ThemedText style={styles.deliveryLabel}>Delivery:</ThemedText>
                <ThemedText style={styles.deliveryValue}>
                  {order.deliveryType === "ToSeat"
                    ? "To your seat"
                    : "Pickup at counter"}
                </ThemedText>
              </View>

              <View style={styles.divider} />

              <ThemedText style={styles.itemsTitle}>Items:</ThemedText>

              {(isGuest ? order.items : order.orderItems)?.map(
                (item: any, index: number) => (
                  <View key={index} style={styles.itemRow}>
                    <ThemedText style={styles.itemQuantity}>
                      {item.quantity}x
                    </ThemedText>
                    <ThemedText style={styles.itemName}>
                      {isGuest ? item.foodItemName : item.foodItemName}
                    </ThemedText>
                    <ThemedText style={styles.itemPrice}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </ThemedText>
                  </View>
                )
              )}

              <View style={styles.divider} />

              <View style={styles.totalRow}>
                <ThemedText style={styles.totalLabel}>Total:</ThemedText>
                <ThemedText style={styles.totalPrice}>
                  ${order.totalAmount.toFixed(2)}
                </ThemedText>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinueShopping}
          >
            <ThemedText style={styles.continueButtonText}>
              Continue Shopping
            </ThemedText>
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 20,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    alignItems: "center",
  },
  successContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    textAlign: "center",
    color: "#9BA1A6",
  },
  orderContainer: {
    width: "100%",
    backgroundColor: "#262D33",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#B4D335",
    padding: 16,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E2429",
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E2429",
  },
  orderContent: {
    padding: 20,
  },
  orderDate: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 16,
  },
  orderStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  orderStatusLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  orderStatusBadge: {
    backgroundColor: "rgba(180, 211, 53, 0.2)",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 100,
  },
  orderStatusText: {
    fontSize: 14,
    color: "#B4D335",
    fontWeight: "bold",
  },
  deliveryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  deliveryLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  deliveryValue: {
    fontSize: 16,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 16,
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  itemQuantity: {
    width: 40,
    fontSize: 14,
    fontWeight: "bold",
  },
  itemName: {
    flex: 1,
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "bold",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  continueButton: {
    width: "100%",
    backgroundColor: "#B4D335",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  continueButtonText: {
    color: "#1E2429",
    fontSize: 16,
    fontWeight: "bold",
  },
  homeButton: {
    backgroundColor: "#B4D335",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  homeButtonText: {
    color: "#1E2429",
    fontSize: 16,
    fontWeight: "bold",
  },
});
