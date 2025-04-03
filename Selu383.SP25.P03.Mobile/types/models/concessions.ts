export interface FoodCategory {
  id: number;
  name: string;
}

export interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  categoryId: number;
  categoryName: string;
}

export interface CartItem {
  foodItemId: number;
  quantity: number;
  specialInstructions?: string;
}

export interface FoodOrder {
  id: number;
  orderTime: string;
  status: string;
  deliveryType: string;
  totalAmount: number;
  userId?: number;
  reservationId?: number;
  orderItems: {
    id: number;
    foodItemId: number;
    foodItemName: string;
    quantity: number;
    price: number;
    specialInstructions?: string;
    foodItemImageUrl?: string;
  }[];
}
