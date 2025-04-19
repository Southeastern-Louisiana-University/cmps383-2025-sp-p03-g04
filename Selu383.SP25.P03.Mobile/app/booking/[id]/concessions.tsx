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
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../../components/ThemeProvider";
import { ThemedView } from "../../../components/ThemedView";
import { ThemedText } from "../../../components/ThemedText";
import { ThemeToggle } from "../../../components/ThemeToggle";

import * as concessionService from "../../../services/concessions/concessionsService";
import { FoodItem } from "../../../types/models/concessions";

export default function BookingConcessionsScreen() {
  const { id, reservationId, deliveryType } = useLocalSearchParams();
  const router = useRouter();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  // State variables
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [foodCategories, setFoodCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadConcessions();
  }, []);

  const loadConcessions = async () => {
    setIsLoading(true);
    try {
      // Load categories
      const categories = await concessionService.getFoodCategories();
      setFoodCategories(categories);

      if (categories.length > 0) {
        setSelectedCategory(categories[0].id);
      }

      // Load all food items
      const items = await concessionService.getConcessions();
      setFoodItems(items);
    } catch (error) {
      console.error("Failed to load concessions:", error);
      Alert.alert("Error", "Failed to load menu items. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (itemId: string) => {
    setCart((prevCart) => ({
      ...prevCart,
      [itemId]: (prevCart[itemId] || 0) + 1,
    }));
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      if (updatedCart[itemId] > 1) {
        updatedCart[itemId] -= 1;
      } else {
        delete updatedCart[itemId];
      }
      return updatedCart;
    });
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [id, quantity]) => {
      const item = foodItems.find((c) => c.id === parseInt(id));
      return total + (item ? item.price * quantity : 0);
    }, 0);
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0);
  };

  const handleProceedToPayment = async () => {
    if (getCartItemCount() === 0) {
      // If cart is empty, just proceed to payment without food
      router.push({
        pathname: `./booking/${id}/payment`,
        params: { reservationId: reservationId as string },
      });
      return;
    }

    try {
      // Create food order items from cart
      const orderItems = Object.entries(cart).map(([foodItemId, quantity]) => ({
        foodItemId: parseInt(foodItemId),
        quantity,
      }));

      // Store in session for payment
      await AsyncStorage.setItem(
        "foodOrderItems",
        JSON.stringify({
          items: orderItems,
          total: getCartTotal(),
          deliveryType: deliveryType as string,
        })
      );

      // Navigate to payment with both reservation and food
      router.push({
        pathname: `./booking/${id}/payment`,
        params: {
          reservationId: reservationId as string,
          hasFood: "true",
        },
      });
    } catch (error) {
      console.error("Error saving food order:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const handleSkip = () => {
    // Skip food and go directly to payment
    router.push({
      pathname: `./booking/${id}/payment`,
      params: { reservationId: reservationId as string },
    });
  };

  // Filter items by selected category
  const filteredItems = selectedCategory
    ? foodItems.filter((item) => item.categoryId === selectedCategory)
    : foodItems;

  // Render loading state
  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B4D335" />
        <ThemedText style={styles.loadingText}>
          Loading menu items...
        </ThemedText>
      </ThemedView>
    );
  }

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
          <ThemedText style={styles.heading}>Add food to your order</ThemedText>

          <ThemedText style={styles.deliveryMode}>
            {deliveryType === "ToSeat"
              ? "Delivery to seat"
              : "Pickup at concession counter"}
          </ThemedText>

          {/* Category selection */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {foodCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.selectedCategory,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <ThemedText
                  style={[
                    styles.categoryText,
                    selectedCategory === category.id &&
                      styles.selectedCategoryText,
                  ]}
                >
                  {category.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Food items */}
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <Image
                  source={{
                    uri: item.imageUrl || "https://via.placeholder.com/80",
                  }}
                  style={styles.itemImage}
                />

                <View style={styles.itemDetails}>
                  <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                  <ThemedText style={styles.itemDescription}>
                    {item.description || "No description available."}
                  </ThemedText>
                  <ThemedText style={styles.itemPrice}>
                    ${item.price.toFixed(2)}
                  </ThemedText>
                </View>

                <View style={styles.itemControls}>
                  {cart[item.id.toString()] ? (
                    <>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleRemoveFromCart(item.id.toString())}
                      >
                        <Ionicons name="remove" size={20} color="#B4D335" />
                      </TouchableOpacity>

                      <ThemedText style={styles.quantityText}>
                        {cart[item.id.toString()]}
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
                      <ThemedText style={styles.addButtonText}>Add</ThemedText>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="fast-food-outline" size={60} color="#666" />
              <ThemedText style={styles.emptyStateText}>
                No items available in this category
              </ThemedText>
            </View>
          )}

          {/* Skip button */}
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <ThemedText style={styles.skipText}>
              Skip food, continue to payment
            </ThemedText>
          </TouchableOpacity>
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
                onPress={handleProceedToPayment}
              >
                <ThemedText style={styles.checkoutButtonText}>
                  Continue to Payment
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
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Extra space for fixed cart
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  deliveryMode: {
    fontSize: 16,
    color: "#B4D335",
    marginBottom: 20,
    textAlign: "center",
  },
  categoriesContainer: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#262D33",
  },
  selectedCategory: {
    backgroundColor: "#B4D335",
  },
  categoryText: {
    fontSize: 14,
    color: "white",
  },
  selectedCategoryText: {
    color: "#242424",
    fontWeight: "bold",
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
  emptyStateContainer: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "#262D33",
    borderRadius: 12,
    marginTop: 20,
  },
  emptyStateText: {
    color: "#9BA1A6",
    marginTop: 10,
    textAlign: "center",
  },
  skipButton: {
    padding: 16,
    marginTop: 30,
    alignItems: "center",
  },
  skipText: {
    color: "#9BA1A6",
    fontSize: 16,
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
