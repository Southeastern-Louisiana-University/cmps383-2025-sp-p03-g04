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
  
  // Simple render for loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#B4D335" />
        <Text style={styles.loadingText}>Loading menu...</Text>
      </View>
    );
  }
  
  // Basic render for content
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Order Food' }} />
      
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
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* Menu Items */}
        <Text style={styles.sectionTitle}>
          {categories.find(c => c.id === selectedCategory)?.name || 'Menu Items'}
        </Text>
        
        {/* Food items list would go here */}
        
        {/* Cart would go here */}
      </ScrollView>
    </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 16,
  },
});