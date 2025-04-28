import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as concessionService from "../services/concessions/concessionsService";
import { FoodItem, FoodCategory } from "../types/models/concessions";

export function useConcessions() {
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deliveryType, setDeliveryType] = useState<"Pickup" | "ToSeat">(
    "Pickup"
  );

  const cartTotal = Object.entries(cart).reduce((sum, [id, quantity]) => {
    const item = foodItems.find((food) => food.id === parseInt(id));
    return sum + (item ? item.price * quantity : 0);
  }, 0);

  const loadConcessions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const categoriesData = await concessionService.getFoodCategories();
      setCategories(categoriesData);

      if (categoriesData.length > 0 && !selectedCategory) {
        setSelectedCategory(categoriesData[0].id);
      }

      const itemsData = await concessionService.getConcessions();
      setFoodItems(itemsData);

      const savedCart = await AsyncStorage.getItem("foodCart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (err) {
      console.error("Failed to load concessions:", err);
      setError("Unable to load menu items. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (Object.keys(cart).length > 0) {
      AsyncStorage.setItem("foodCart", JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (itemId: string) => {
    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const updated = { ...prev };

      if (updated[itemId] > 1) {
        updated[itemId] -= 1;
      } else {
        delete updated[itemId];
      }

      return updated;
    });
  };

  const clearCart = () => {
    setCart({});
    AsyncStorage.removeItem("foodCart");
  };

  const getOrderItems = () => {
    return Object.entries(cart).map(([id, quantity]) => {
      const item = foodItems.find((food) => food.id === parseInt(id));

      return {
        foodItemId: parseInt(id),
        quantity,
        foodItemName: item?.name || "Unknown Item",
        price: item?.price || 0,
      };
    });
  };

  const getFilteredItems = () => {
    if (!selectedCategory) return foodItems;
    return foodItems.filter((item) => item.categoryId === selectedCategory);
  };

  return {
    categories,
    foodItems: getFilteredItems(),
    selectedCategory,
    setSelectedCategory,
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    isLoading,
    error,
    cartTotal,
    itemCount: Object.values(cart).reduce((sum, qty) => sum + qty, 0),
    loadConcessions,
    getOrderItems,
    deliveryType,
    setDeliveryType,
  };
}
