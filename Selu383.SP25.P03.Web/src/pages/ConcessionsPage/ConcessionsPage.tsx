// Creating a new version of ConcessionsPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Add useParams and useNavigate
import "./ConcessionsPage.css";
import Footer from "../../components/Footer/Footer";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import { FoodItem, FoodCategory } from "../../types/Concessions";


const ConcessionsPage: React.FC = () => {
  const params = useParams(); // Get URL parameters
  const navigate = useNavigate(); // For navigation
  const showtimeId = params.id; // Get ID from URL if it exists
  
  
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [cartFoodItems, setCartFoodItems] = useState<{item: FoodItem, quantity: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0); // Add retry counter

  // Fetch food items and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/food-items/categories');
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
        
        // Retry logic if server error (500)
        if (retryCount < 3 && err instanceof Error && err.message.includes("500")) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000); // Retry after 2 seconds
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [retryCount]); // Add retryCount to dependencies

  // When coming from booking page, handle any showtimeId
  useEffect(() => {
    if (showtimeId) {
      // Here we could load reservation data if needed
      console.log(`Concessions page opened with showtime ID: ${showtimeId}`);
      
      // We could also redirect to the normal concessions page if preferred
      // navigate('/concessions', { replace: true });
    }
  }, [showtimeId, navigate]);

  // Filter items by selected category
  const filteredItems = selectedCategory
    ? foodItems.filter(item => item.categoryId === selectedCategory && item.isAvailable)
    : foodItems.filter(item => item.isAvailable);

  // Add item to cart
  const handleAddToCart = (item: FoodItem) => {
    setCartFoodItems(prevItems => {
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
    
    // If we have a showtimeId, we could associate this concession with a booking
    if (showtimeId) {
      // Logic to associate with booking
      console.log(`Adding concession item for showtime: ${showtimeId}`);
    }
  };

  // Remove item from cart
  const removeFromCart = (itemId: number) => {
    setCartFoodItems(prevItems => {
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
    return cartFoodItems.reduce((total, cartItem) => 
      total + (cartItem.item.price * cartItem.quantity), 0
    ).toFixed(2);
  };

  // Mock data to use if API fails
  const getMockData = () => {
    const mockCategories: FoodCategory[] = [
      { id: 1, name: "Popcorn" },
      { id: 2, name: "Drinks" },
      { id: 3, name: "Candy" },
      { id: 4, name: "Combos" }
    ];
    
    const mockItems: FoodItem[] = [
      {
        id: 1,
        name: "Small Popcorn",
        description: "Freshly popped corn, perfect for one",
        price: 5.99,
        imageUrl: "/images/placeholder-food.jpg",
        isAvailable: true,
        categoryId: 1,
        categoryName: "Popcorn"
      },
      {
        id: 2,
        name: "Medium Soda",
        description: "Refreshing soda of your choice",
        price: 4.99,
        imageUrl: "/images/placeholder-food.jpg",
        isAvailable: true,
        categoryId: 2,
        categoryName: "Drinks"
      },
      {
        id: 3,
        name: "Chocolate Bar",
        description: "Delicious milk chocolate",
        price: 3.99,
        imageUrl: "/images/placeholder-food.jpg",
        isAvailable: true,
        categoryId: 3,
        categoryName: "Candy"
      }
    ];
    
    return { categories: mockCategories, items: mockItems };
  };

  // If API fails, use mock data after 3 retries
  useEffect(() => {
    if (retryCount >= 3 && (categories.length === 0 || foodItems.length === 0)) {
      const { categories: mockCategories, items: mockItems } = getMockData();
      setCategories(mockCategories);
      setFoodItems(mockItems);
      setSelectedCategory(mockCategories[0].id);
      setError("Using demo data. The server is currently unavailable.");
    }
  }, [retryCount, categories.length, foodItems.length]);

  // Checkout handler
  const handleCheckout = () => {
    // Here we would integrate with the payment system
    if (showtimeId) {
      navigate(`/payment/${showtimeId}`, { 
        state: { concessions: cartFoodItems }
      });
    } else {
      // Regular concessions checkout
      alert("Concessions checkout would be implemented here!");
    }
  };

  // Function to retry loading
  const handleRetry = () => {
    setRetryCount(0);
    setError(null);
  };

  // Loading state
  if (loading && retryCount < 3) {
    return (
      <div className="concessions-page">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading concessions menu...</p>
        </div>
      </div>
    );
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

      {error && (
        <div className="error-banner">
          <p>{error}</p>
          {retryCount >= 3 && (
            <button onClick={handleRetry} className="retry-btn">
              Retry Connection
            </button>
          )}
        </div>
      )}

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
                    <button className="add-to-cart" onClick={() => handleAddToCart(item)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={`cart-container ${cartFoodItems.length > 0 ? 'has-items' : ''}`}>
          <h2>Your Order</h2>
          
          {cartFoodItems.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <p>Add items from the menu to get started</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartFoodItems.map(cartItem => (
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
                        onClick={() => handleAddToCart(cartItem.item)}
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
                  {showtimeId ? "Continue to Payment" : "Checkout"}
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