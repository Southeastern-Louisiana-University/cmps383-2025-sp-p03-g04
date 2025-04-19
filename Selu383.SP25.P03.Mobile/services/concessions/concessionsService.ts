import { fetchWithCredentials } from "../api/config";
import {
  FoodCategoryResponse,
  FoodItemResponse,
  FoodOrderRequest,
  FoodOrderResponse,
} from "../../types/api/concessions";
import { FoodCategory, FoodItem } from "../../types/models/concessions";
import { API_ENDPOINTS } from "../../constants/api-constants";

// Get all food categories
export const getFoodCategories = async (): Promise<FoodCategory[]> => {
  return fetchWithCredentials<FoodCategoryResponse[]>(
    API_ENDPOINTS.FOOD_CATEGORIES
  );
};

// Get all food items
export const getFoodItems = async (): Promise<FoodItem[]> => {
  return fetchWithCredentials<FoodItemResponse[]>(API_ENDPOINTS.FOOD_ITEMS);
};

/**
 * Get food items by category
 */
export const getFoodItemsByCategory = async (
  categoryId: number
): Promise<FoodItem[]> => {
  return fetchWithCredentials<FoodItemResponse[]>(
    `/api/food-items/category/${categoryId}`
  );
};

/**
 * Create a food order
 */
export const createFoodOrder = async (
  order: FoodOrderRequest
): Promise<FoodOrderResponse> => {
  return fetchWithCredentials<FoodOrderResponse>("/api/food-orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
};

/**
 * Get all food orders for the current user
 */
export const getUserFoodOrders = async (): Promise<FoodOrderResponse[]> => {
  return fetchWithCredentials<FoodOrderResponse[]>(
    "/api/food-orders/my-orders"
  );
};

/**
 * Get a food order by ID
 */
export const getFoodOrder = async (id: number): Promise<FoodOrderResponse> => {
  return fetchWithCredentials<FoodOrderResponse>(`/api/food-orders/${id}`);
};

/**
 * Cancel a food order
 */
export const cancelFoodOrder = async (id: number): Promise<void> => {
  return fetchWithCredentials<void>(`/api/food-orders/${id}`, {
    method: "DELETE",
  });
};
