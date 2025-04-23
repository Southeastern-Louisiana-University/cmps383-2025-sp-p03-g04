import React, { useState, useEffect } from "react";
import "./ConcessionsPage.css";
import Footer from "../../components/Footer/Footer";
import ThemeToggle from "../../components/ThemeToggle/themetoggle";
import { FoodItem, FoodCategory } from "../../types/Concessions";


const ConcessionsPage: React.FC = () => {
  
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [cartItems, setCartItems] = useState<{item: FoodItem, quantity: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch food items and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/food-categories');
        if (!categoriesResponse.ok) {
          throw new Error(`Failed to fetch categories: ${categoriesResponse.status}`);
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
        
        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].id);
        }
        
        // Fetch all food items
        const itemsResponse = await fetch('/api/food-items');
        if (!itemsResponse.ok) {
          throw new Error(`Failed to fetch food items: ${itemsResponse.status}`);
        }
        const itemsData = await itemsResponse.json();
        setFoodItems(itemsData);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load concessions data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter items by selected category
  const filteredItems = selectedCategory
    ? foodItems.filter(item => item.categoryId === selectedCategory && item.isAvailable)
    : foodItems.filter(item => item.isAvailable);

  // Add item to cart
  const addToCart = (item: FoodItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.item.id === item.id);
      
      if (existingItem) {
        // Item already in cart, increase quantity
        return prevItems.map(cartItem => 
          cartItem.item.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        // Add new item to cart
        return [...prevItems, { item, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.item.id === itemId);
      
      if (existingItem && existingItem.quantity > 1) {
        // Decrease quantity if more than 1
        return prevItems.map(cartItem => 
          cartItem.item.id === itemId 
            ? { ...cartItem, quantity: cartItem.quantity - 1 } 
            : cartItem
        );
      } else {
        // Remove item entirely if quantity is 1
        return prevItems.filter(cartItem => cartItem.item.id !== itemId);
      }
    });
  };

  // Calculate total cost
  const calculateTotal = () => {
    return cartItems.reduce((total, cartItem) => 
      total + (cartItem.item.price * cartItem.quantity), 0
    ).toFixed(2);
  };

  // Checkout handler
  const handleCheckout = () => {
    // Would normally navigate to checkout page or integrate with payment system
    alert("Checkout functionality would be integrated here!");
  };

  // Loading state
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  // Error state
  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="concessions-page">
      <div className="hero-banner">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Concessions</h1>
          <p>Enhance your movie experience with our delicious food and drinks</p>
          <div className="theme-toggle-wrapper">
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="content-container">
        <div className="categories-menu">
          <h2>Menu</h2>
          <div className="category-tabs">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="food-items-grid">
          {filteredItems.length === 0 ? (
            <div className="no-items">No items available in this category</div>
          ) : (
            filteredItems.map(item => (
              <div key={item.id} className="food-item-card">
                <div className="food-image">
                  <img 
                    src={item.imageUrl || "/images/placeholder-food.jpg"} 
                    alt={item.name}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/images/placeholder-food.jpg";
                    }}
                  />
                </div>
                <div className="food-info">
                  <h3 className="food-name">{item.name}</h3>
                  <p className="food-description">{item.description || "No description available"}</p>
                  <div className="food-price-action">
                    <span className="food-price">${item.price.toFixed(2)}</span>
                    <button className="add-to-cart" onClick={() => addToCart(item)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={`cart-container ${cartItems.length > 0 ? 'has-items' : ''}`}>
          <h2>Your Order</h2>
          
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <p>Add items from the menu to get started</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartItems.map(cartItem => (
                  <div key={cartItem.item.id} className="cart-item">
                    <div className="cart-item-info">
                      <span className="cart-item-name">{cartItem.item.name}</span>
                      <span className="cart-item-price">${(cartItem.item.price * cartItem.quantity).toFixed(2)}</span>
                    </div>
                    <div className="quantity-control">
                      <button 
                        className="quantity-btn minus" 
                        onClick={() => removeFromCart(cartItem.item.id)}
                      >
                        -
                      </button>
                      <span className="quantity">{cartItem.quantity}</span>
                      <button 
                        className="quantity-btn plus" 
                        onClick={() => addToCart(cartItem.item)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="cart-summary">
                <div className="cart-total">
                  <span>Total</span>
                  <span>${calculateTotal()}</span>
                </div>
                <button className="checkout-btn" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ConcessionsPage;