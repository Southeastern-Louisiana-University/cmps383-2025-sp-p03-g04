import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../components/AuthProvider";
import { useTheme } from "../../components/ThemeProvider";
import { ThemedView } from "../../components/ThemedView";
import { ThemedText } from "../../components/ThemedText";
import { ThemeToggle } from "../../components/ThemeToggle";

import * as concessionService from "../../services/concessions/concessionsService";

export default function ConcessionsScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  // State variables
  const [concessions, setConcessions] = useState<any[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConcessions();
  }, []);

  const loadConcessions = async () => {
    setIsLoading(true);
    try {
      const concessionsData = await concessionService.getConcessions();
      if (Array.isArray(concessionsData)) {
        setConcessions(concessionsData);
      } else {
        console.error("Invalid data format:", concessionsData);
        setConcessions([]);
      }
    } catch (error) {
      console.error("Failed to load concessions:", error);
      setConcessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (concessionId: string) => {
    setCart((prevCart) => ({
      ...prevCart,
      [concessionId]: (prevCart[concessionId] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (concessionId: string) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[concessionId] > 1) {
        updatedCart[concessionId] -= 1;
      } else {
        delete updatedCart[concessionId];
      }
      return updatedCart;
    });
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [id, quantity]) => {
      const item = concessions.find((c) => c.id === parseInt(id));
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Sign In Required",
        "Please sign in to complete your order.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Sign In", onPress: () => router.push("/login") },
        ]
      );
      return;
    }

    // Proceed with checkout for authenticated users
    if (getCartItemCount() === 0) {
      Alert.alert("Empty Cart", "Please add items to your cart first.");
      return;
    }

    Alert.alert(
      "Order Placed!",
      "Your order has been placed and will be delivered to your seat.",
      [{ text: "OK", onPress: () => setCart({}) }]
    );
  };

  // Render loading state
  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B4D335" />
        <ThemedText style={styles.loadingText}>
          Loading menu items...
        </ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={loadConcessions}>
          <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  // Categorize concessions
  const categorized = concessions.reduce((acc: any, item: any) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <>
      <Stack.Screen
        options={{
          title: "Order Food",
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
          <ThemedText style={styles.heading}>
            Order food delivered to your seat
          </ThemedText>

          {Object.entries(categorized).map(
            ([category, items]: [string, any]) => (
              <View key={category} style={styles.categorySection}>
                <ThemedText style={styles.categoryTitle}>{category}</ThemedText>

                {items.map((item: any) => (
                  <View key={item.id} style={styles.itemCard}>
                    <Image
                      source={{
                        uri: item.imageUrl || "https://via.placeholder.com/80",
                      }}
                      style={styles.itemImage}
                    />

                    <View style={styles.itemDetails}>
                      <ThemedText style={styles.itemName}>
                        {item.name}
                      </ThemedText>
                      <ThemedText style={styles.itemDescription}>
                        {item.description || "No description available."}
                      </ThemedText>
                      <ThemedText style={styles.itemPrice}>
                        ${item.price.toFixed(2)}
                      </ThemedText>
                    </View>

                    <View style={styles.itemControls}>
                      {cart[item.id] ? (
                        <>
                          <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() =>
                              handleRemoveFromCart(item.id.toString())
                            }
                          >
                            <Ionicons name="remove" size={20} color="#B4D335" />
                          </TouchableOpacity>

                          <ThemedText style={styles.quantityText}>
                            {cart[item.id]}
                          </ThemedText>

                          <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => handleAddToCart(item.id.toString())}
                          >
                            <Ionicons name="add" size={20} color="#B4D335" />
                          </TouchableOpacity>
                        </>
                      ) : (
                        <TouchableOpacity
                          style={styles.addButton}
                          onPress={() => handleAddToCart(item.id.toString())}
                        >
                          <ThemedText style={styles.addButtonText}>
                            Add
                          </ThemedText>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )
          )}
        </ScrollView>

        {/* Cart summary at bottom */}
        {getCartItemCount() > 0 && (
          <View style={styles.cartContainer}>
            <View style={styles.cartSummary}>
              <View>
                <ThemedText style={styles.cartItemCount}>
                  {getCartItemCount()} items
                </ThemedText>
                <ThemedText style={styles.cartTotal}>
                  ${getCartTotal().toFixed(2)}
                </ThemedText>
              </View>

              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={handleCheckout}
              >
                <ThemedText style={styles.checkoutButtonText}>
                  Checkout
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        )}

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
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#B4D335",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#1E2429",
    fontWeight: "bold",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#B4D335",
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#262D33",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: "center",
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: "#9BA1A6",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#B4D335",
  },
  itemControls: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  addButton: {
    backgroundColor: "rgba(180, 211, 53, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#B4D335",
    fontWeight: "bold",
  },
  quantityButton: {
    width: 30,
    height: 30,
    backgroundColor: "rgba(180, 211, 53, 0.2)",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  cartContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1E2429",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    elevation: 10,
    padding: 16,
  },
  cartSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartItemCount: {
    fontSize: 14,
    color: "#9BA1A6",
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#B4D335",
  },
  checkoutButton: {
    backgroundColor: "#B4D335",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  checkoutButtonText: {
    color: "#1E2429",
    fontSize: 16,
    fontWeight: "bold",
  },
});
