export interface FoodCategoryResponse {
    id: number;
    name: string;
  }
  
  export interface FoodItemResponse {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    isAvailable: boolean;
    categoryId: number;
    categoryName: string;
  }
  
  export interface FoodOrderItemRequest {
    foodItemId: number;
    quantity: number;
    specialInstructions?: string;
  }
  
  export interface FoodOrderRequest {
    deliveryType: 'Pickup' | 'ToSeat';
    reservationId?: number;
    orderItems: FoodOrderItemRequest[];
  }
  
  export interface FoodOrderItemResponse {
    id: number;
    foodItemId: number;
    foodItemName: string;
    quantity: number;
    price: number;
    specialInstructions?: string;
    foodItemImageUrl?: string;
  }
  
  export interface FoodOrderResponse {
    id: number;
    orderTime: string;
    status: string;
    deliveryType: string;
    totalAmount: number;
    userId?: number;
    reservationId?: number;
    orderItems: FoodOrderItemResponse[];
  }