export interface FoodItem {
    id: number;
    name: string;
    description: string | null;
    price: number;
    imageUrl: string | null;
    isAvailable: boolean;
    categoryId: number;
    categoryName: string | null;
  }
  
  export interface FoodCategory {
    id: number;
    name: string;
  }
  
  export interface FoodOrderItem {
    id: number;
    foodItemId: number;
    foodItemName: string;
    quantity: number;
    price: number;
    specialInstructions: string | null;
    foodItemImageUrl: string | null;
  }
  
  export interface FoodOrder {
    id: number;
    orderTime: string;
    status: string;
    deliveryType: string;
    totalAmount: number;
    userId: number | null;
    reservationId: number | null;
    orderItems: FoodOrderItem[];
  }
  
  export interface CreateFoodOrderRequest {
    deliveryType: string;
    reservationId?: number;
    orderItems: {
      foodItemId: number;
      quantity: number;
      specialInstructions?: string;
    }[];
  }