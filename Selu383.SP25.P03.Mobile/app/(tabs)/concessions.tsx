import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "../../components/ThemedText";
import { ThemedView } from "../../components/ThemedView";
import * as concessionsService from "../../services/concessions/concessionsService";
import {
  FoodCategory,
  FoodItem,
  CartItem,
} from "../../types/models/concessions";
import { concessionsScreenStyles as styles } from "../../styles/screens/concessionsScreen";

export default function ConcessionsScreen() {
  const router = useRouter();

  // Basic state setup
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [categoriesData, foodItemsData] = await Promise.all([
          concessionsService.getFoodCategories(),
          concessionsService.getAllFoodItems(),
        ]);

        setCategories(categoriesData);
        setFoodItems(foodItemsData);

        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        Alert.alert("Error", "Failed to load menu data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add item to cart handler
  const handleAddToCart = (item: FoodItem) => {
    // Check if item already exists in cart
    const existingItem = cart.find(
      (cartItem) => cartItem.foodItemId === item.id
    );

    if (existingItem) {
      // Update quantity if item already exists
      setCart(
        cart.map((cartItem) =>
          cartItem.foodItemId === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      // Add new item to cart
      setCart([...cart, { foodItemId: item.id, quantity: 1 }]);
    }

    Alert.alert("Added to Cart", `${item.name} added to your cart`);
  };

  // Filter food items by selected category
  const filteredFoodItems = foodItems.filter(
    (item) => selectedCategory === item.categoryId
  );

  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => {
    const foodItem = foodItems.find((f) => f.id === item.foodItemId);
    return total + (foodItem ? foodItem.price * item.quantity : 0);
  }, 0);

  // Render a food item
  const renderFoodItem = ({ item }: { item: FoodItem }) => (
    <View style={styles.foodItemCard}>
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.foodImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.foodItemContent}>
        <ThemedText style={styles.foodItemName}>{item.name}</ThemedText>

        {item.description && (
          <ThemedText style={styles.foodItemDescription} numberOfLines={2}>
            {item.description}
          </ThemedText>
        )}

        <View style={styles.foodItemFooter}>
          <ThemedText style={styles.foodItemPrice}>
            ${item.price.toFixed(2)}
          </ThemedText>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddToCart(item)}
            disabled={!item.isAvailable}
          >
            <ThemedText style={styles.addButtonText}>
              {item.isAvailable ? "Add" : "Unavailable"}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Simple render for loading state
  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#B4D335" />
        <ThemedText style={styles.loadingText}>Loading menu...</ThemedText>
      </ThemedView>
    );
  }

  // Rest of the component remains the same
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Order Food",
          // Fix the back button navigation issue by adding this
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push("/(tabs)")}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#242424" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView>
        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
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

        {/* Menu Items */}
        <ThemedText style={styles.sectionTitle}>
          {categories.find((c) => c.id === selectedCategory)?.name ||
            "Menu Items"}
        </ThemedText>

        {/* Now actually render the food items */}
        {filteredFoodItems.length > 0 ? (
          <FlatList
            data={filteredFoodItems}
            renderItem={renderFoodItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false} // Prevent nested scrolling issues
          />
        ) : (
          <ThemedView style={styles.emptyStateContainer}>
            <Ionicons name="fast-food-outline" size={50} color="#666" />
            <ThemedText style={styles.emptyStateText}>
              No items available in this category
            </ThemedText>
          </ThemedView>
        )}

        {/* Cart Summary */}
        {cart.length > 0 && (
          <View style={styles.cartContainer}>
            <ThemedText style={styles.cartTitle}>Your Order</ThemedText>

            {cart.map((item) => {
              const foodItem = foodItems.find((f) => f.id === item.foodItemId);
              if (!foodItem) return null;

              return (
                <View key={item.foodItemId} style={styles.cartItem}>
                  <ThemedText style={styles.cartItemName}>
                    {item.quantity}x {foodItem.name}
                  </ThemedText>
                  <ThemedText style={styles.cartItemPrice}>
                    ${(foodItem.price * item.quantity).toFixed(2)}
                  </ThemedText>
                </View>
              );
            })}

            <View style={styles.cartTotal}>
              <ThemedText style={styles.cartTotalText}>Total</ThemedText>
              <ThemedText style={styles.cartTotalPrice}>
                ${cartTotal.toFixed(2)}
              </ThemedText>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => {
                // Navigate to checkout
                router.push("./(tabs)/checkout");
              }}
            >
              <ThemedText style={styles.checkoutButtonText}>
                Proceed to Checkout
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}
