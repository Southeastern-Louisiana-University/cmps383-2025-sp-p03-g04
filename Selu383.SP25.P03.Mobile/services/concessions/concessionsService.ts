import { fetchWithCredentials } from "../api/config";
import {
  FoodCategoryResponse,
  FoodItemResponse,
  FoodOrderRequest,
  FoodOrderResponse,
} from "../../types/api/concessions";
import { FoodCategory, FoodItem } from "../../types/models/concessions";

/**
 * Get all food categories
 */
export const getFoodCategories = async (): Promise<FoodCategory[]> => {
  return fetchWithCredentials<FoodCategoryResponse[]>("/api/food-categories");
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
 * Get all food items
 */
export const getAllFoodItems = async (): Promise<FoodItem[]> => {
  return fetchWithCredentials<FoodItemResponse[]>("/api/food-items");
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

export function getConcessions() {
  throw new Error("Function not implemented.");
}
