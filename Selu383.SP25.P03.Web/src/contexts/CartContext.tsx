import React, { createContext, useContext, useState, ReactNode } from "react";
import { CartItem } from "../types/booking";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      if (item.type === "food") {
        return [...prevItems, item];
      } else {
        const existingItemIndex = prevItems.findIndex(
          (i) => i.type !== "food" && i.seatId === item.seatId
        );

        if (existingItemIndex > -1) {
          const newItems = [...prevItems];
          newItems[existingItemIndex] = item;
          return newItems;
        }

        return [...prevItems, item];
      }
    });
  };

  const removeFromCart = (index: number) => {
    setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
