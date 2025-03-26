import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  ActivityIndicator,
  Alert 
} from "react-native";
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as api from '../../services/api';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';

export default function ConcessionsScreen() {
  const router = useRouter();
  
  // Basic state setup
  const [categories, setCategories] = useState<api.FoodCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [foodItems, setFoodItems] = useState<api.FoodItem[]>([]);
  const [cart, setCart] = useState<api.FoodOrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [categoriesData, foodItemsData] = await Promise.all([
          api.getFoodCategories(),
          api.getAllFoodItems()
        ]);
        
        setCategories(categoriesData);
        setFoodItems(foodItemsData);
        
        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        Alert.alert('Error', 'Failed to load menu data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Add item to cart handler
  const handleAddToCart = (item: api.FoodItem) => {
    // Check if item already exists in cart
    const existingItem = cart.find(cartItem => cartItem.foodItemId === item.id);
    
    if (existingItem) {
      // Update quantity if item already exists
      setCart(cart.map(cartItem => 
        cartItem.foodItemId === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 } 
          : cartItem
      ));
    } else {
      // Add new item to cart
      setCart([...cart, { foodItemId: item.id, quantity: 1 }]);
    }
    
    Alert.alert('Added to Cart', `${item.name} added to your cart`);
  };
  
  // Filter food items by selected category
  const filteredFoodItems = foodItems.filter(
    item => selectedCategory === item.categoryId
  );
  
  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => {
    const foodItem = foodItems.find(f => f.id === item.foodItemId);
    return total + (foodItem ? foodItem.price * item.quantity : 0);
  }, 0);
  
  // Render a food item
  const renderFoodItem = ({ item }: { item: api.FoodItem }) => (
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
              {item.isAvailable ? 'Add' : 'Unavailable'}
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
  
  // Basic render for content
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Order Food',
          // Fix the back button navigation issue by adding this
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push('/(tabs)')}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#242424" />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView>
        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.selectedCategory
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <ThemedText style={[
                styles.categoryText,
                selectedCategory === category.id && styles.selectedCategoryText
              ]}>
                {category.name}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* Menu Items */}
        <ThemedText style={styles.sectionTitle}>
          {categories.find(c => c.id === selectedCategory)?.name || 'Menu Items'}
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
            
            {cart.map(item => {
              const foodItem = foodItems.find(f => f.id === item.foodItemId);
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
                router.push('./(tabs)/checkout');
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

// Define styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2429',
    padding: 16,
  },
  loadingText: {
    color: '#9BA1A6',
    marginTop: 10,
    textAlign: 'center'
  },
  categoriesContainer: {
    marginVertical: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#262D33',
  },
  selectedCategory: {
    backgroundColor: '#B4D335',
  },
  categoryText: {
    fontSize: 14,
    color: 'white',
  },
  selectedCategoryText: {
    color: '#242424',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 16,
  },
  foodItemCard: {
    backgroundColor: '#262D33',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  foodImage: {
    width: 100,
    height: 100,
  },
  foodItemContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  foodItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  foodItemDescription: {
    fontSize: 14,
    color: '#9BA1A6',
    marginBottom: 8,
  },
  foodItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B4D335',
  },
  addButton: {
    backgroundColor: '#B4D335',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#242424',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#262D33',
    borderRadius: 12,
  },
  emptyStateText: {
    color: '#9BA1A6',
    marginTop: 10,
    textAlign: 'center',
  },
  cartContainer: {
    backgroundColor: '#262D33',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 40,
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  cartItemName: {
    color: 'white',
    fontSize: 14,
  },
  cartItemPrice: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cartTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  cartTotalText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartTotalPrice: {
    color: '#B4D335',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#B4D335',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  checkoutButtonText: {
    color: '#242424',
    fontWeight: 'bold',
    fontSize: 16,
  },
});