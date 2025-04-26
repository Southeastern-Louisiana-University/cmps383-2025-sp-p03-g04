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
import { FoodItem } from "../../types/models/concessions";

export default function ConcessionsScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { colorScheme } = useTheme();
  const isDark = colorScheme === "dark";

  // State variables
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
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
      const categoriesData = await concessionService.getFoodCategories();
      if (Array.isArray(categoriesData)) {
        setCategories(categoriesData);
        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].id);
        }
      } else {
        console.error("Categories data is not an array:", categoriesData);
        setCategories([]);
      }

      // Load all food items
      const itemsData = await concessionService.getConcessions();
      if (Array.isArray(itemsData)) {
        setFoodItems(itemsData);
      } else {
        console.error("Food items data is not an array:", itemsData);
        setFoodItems([]);
      }
    } catch (error) {
      console.error("Failed to load concessions:", error);
      Alert.alert("Error", "Failed to load menu items. Please try again.");
      setCategories([]);
      setFoodItems([]);
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
        return updatedCart;
      } else {
        delete updatedCart[itemId];
        return updatedCart;
      }
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

  const handleCheckout = () => {
    if (getCartItemCount() === 0) {
      Alert.alert("Empty Cart", "Please add items to your cart first.");
      return;
    }

    // Convert cart to the format expected by the delivery selection screen
    const cartItems = Object.entries(cart).map(([itemId, quantity]) => {
      const item = foodItems.find((c) => c.id === parseInt(itemId));
      return {
        foodItemId: parseInt(itemId),
        foodItemName: item ? item.name : "Unknown Item",
        price: item ? item.price : 0,
        quantity,
      };
    });

    // Store cart items in AsyncStorage for the next screen
    try {
      // Navigate to delivery option screen
      router.push({
        pathname: "../food-checkout/delivery-option",
        params: { cartItems: JSON.stringify(cartItems) }
      });
    } catch (error) {
      console.error("Error navigating to checkout:", error);
      Alert.alert("Error", "Could not proceed to checkout. Please try again.");
    }
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
        }}
      />

      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText style={styles.heading}>
            Order food to enjoy with your movie
          </ThemedText>

          {/* Categories */}
          {categories.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {categories.map((category) => (
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
          )}

          {/* Food Items */}
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <View key={item.id} style={styles.foodItemCard}>
                <Image
                  source={{
                    uri: item.imageUrl || "https://via.placeholder.com/100",
                  }}
                  style={styles.foodImage}
                />
                <View style={styles.foodItemContent}>
                  <ThemedText style={styles.foodItemName}>
                    {item.name}
                  </ThemedText>
                  <ThemedText style={styles.foodItemDescription}>
                    {item.description || "No description available"}
                  </ThemedText>
                  <View style={styles.foodItemFooter}>
                    <ThemedText style={styles.foodItemPrice}>
                      ${item.price.toFixed(2)}
                    </ThemedText>
                    
                    {cart[item.id.toString()] ? (
                      <View style={styles.quantityControls}>
                        <TouchableOpacity
                          onPress={() => handleRemoveFromCart(item.id.toString())}
                        >
                          <Ionicons name="remove-circle" size={24} color="#B4D335" />
                        </TouchableOpacity>
                        <ThemedText style={styles.quantityText}>
                          {cart[item.id.toString()]}
                        </ThemedText>
                        <TouchableOpacity
                          onPress={() => handleAddToCart(item.id.toString())}
                        >
                          <Ionicons name="add-circle" size={24} color="#B4D335" />
                        </TouchableOpacity>
                      </View>
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
              </View>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="fast-food-outline" size={60} color="#9BA1A6" />
              <ThemedText style={styles.emptyStateText}>
                No items available in this category
              </ThemedText>
            </View>
          )}
        </ScrollView>

        {/* Cart summary at bottom */}
        {getCartItemCount() > 0 && (
          <View style={styles.cartContainer}>
            <View style={styles.cartTitle}>
              <ThemedText style={styles.cartTitleText}>Your Order</ThemedText>
              <ThemedText style={styles.cartItemCount}>
                {getCartItemCount()} items
              </ThemedText>
            </View>
            
            <View style={styles.cartTotal}>
              <ThemedText style={styles.cartTotalText}>Total:</ThemedText>
              <ThemedText style={styles.cartTotalPrice}>
                ${getCartTotal().toFixed(2)}
              </ThemedText>
            </View>
            
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <ThemedText style={styles.checkoutButtonText}>
                Proceed to Checkout
              </ThemedText>
            </TouchableOpacity>
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
    backgroundColor: "#1E2429",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#9BA1A6",
    marginTop: 10,
    textAlign: "center",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  categoriesContainer: {
    marginVertical: 10,
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
  foodItemCard: {
    backgroundColor: "#262D33",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    flexDirection: "row",
  },
  foodImage: {
    width: 100,
    height: 100,
  },
  foodItemContent: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  foodItemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  foodItemDescription: {
    fontSize: 14,
    color: "#9BA1A6",
    marginBottom: 8,
  },
  foodItemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  foodItemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#B4D335",
  },
  addButton: {
    backgroundColor: "#B4D335",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: {
    color: "#242424",
    fontWeight: "bold",
    fontSize: 14,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityText: {
    marginHorizontal: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#262D33",
    borderRadius: 12,
  },
  emptyStateText: {
    color: "#9BA1A6",
    marginTop: 10,
    textAlign: "center",
  },
  cartContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#262D33",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cartTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cartTitleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  cartItemCount: {
    fontSize: 14,
    color: "#9BA1A6",
  },
  cartTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  cartTotalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  cartTotalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#B4D335",
  },
  checkoutButton: {
    backgroundColor: "#B4D335",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  checkoutButtonText: {
    color: "#242424",
    fontWeight: "bold",
    fontSize: 16,
  },
});