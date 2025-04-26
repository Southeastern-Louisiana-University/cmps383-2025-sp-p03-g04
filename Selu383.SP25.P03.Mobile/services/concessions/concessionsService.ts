import { fetchWithCredentials } from "../api/config";
import { API_ENDPOINTS } from "../../constants/api-constants";
import {
  FoodCategoryResponse,
  FoodItemResponse,
  FoodOrderRequest,
  FoodOrderResponse,
} from "../../types/api/concessions";
import { FoodCategory, FoodItem } from "../../types/models/concessions";

export const getConcessions = async (): Promise<FoodItem[]> => {
  return fetchWithCredentials<FoodItemResponse[]>(API_ENDPOINTS.FOOD_ITEMS);
};

export const getFoodCategories = async (): Promise<FoodCategory[]> => {
  return fetchWithCredentials<FoodCategoryResponse[]>(
    API_ENDPOINTS.FOOD_CATEGORIES
  );
};

export const getFoodItems = async (): Promise<FoodItem[]> => {
  return fetchWithCredentials<FoodItemResponse[]>(API_ENDPOINTS.FOOD_ITEMS);
};

export const getFoodItemsByCategory = async (
  categoryId: number
): Promise<FoodItem[]> => {
  return fetchWithCredentials<FoodItemResponse[]>(
    API_ENDPOINTS.FOOD_ITEMS_BY_CATEGORY(categoryId)
  );
};

export const createFoodOrder = async (
  order: FoodOrderRequest
): Promise<FoodOrderResponse> => {
  return fetchWithCredentials<FoodOrderResponse>(API_ENDPOINTS.FOOD_ORDERS, {
    method: "POST",
    body: JSON.stringify(order),
  });
};

export const getUserFoodOrders = async (): Promise<FoodOrderResponse[]> => {
  return fetchWithCredentials<FoodOrderResponse[]>(
    API_ENDPOINTS.USER_FOOD_ORDERS
  );
};

export const getFoodOrder = async (id: number): Promise<FoodOrderResponse> => {
  return fetchWithCredentials<FoodOrderResponse>(
    `${API_ENDPOINTS.FOOD_ORDERS}/${id}`
  );
};

export const cancelFoodOrder = async (id: number): Promise<void> => {
  return fetchWithCredentials<void>(`${API_ENDPOINTS.FOOD_ORDERS}/${id}`, {
    method: "DELETE",
  });
};
