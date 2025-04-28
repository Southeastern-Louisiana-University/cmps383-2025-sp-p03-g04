import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ConcessionsPage.css";
import Footer from "../../components/Footer/Footer";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import { FoodItem, FoodCategory } from "../../types/Concessions";
import { useCart } from "../../contexts/CartContext";

const ConcessionsPage: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems, removeFromCart, total } = useCart();
  const showtimeId = params.id;

  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [addedToCart, setAddedToCart] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const categoriesResponse = await fetch("/api/food-items/categories");
        if (!categoriesResponse.ok) {
          throw new Error(
            `Failed to fetch categories: ${categoriesResponse.status}`
          );
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].id);
        }

        const itemsResponse = await fetch("/api/food-items");
        if (!itemsResponse.ok) {
          throw new Error(
            `Failed to fetch food items: ${itemsResponse.status}`
          );
        }
        const itemsData = await itemsResponse.json();
        setFoodItems(itemsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load concessions data. Please try again later.");

        if (
          retryCount < 3 &&
          err instanceof Error &&
          err.message.includes("500")
        ) {
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [retryCount]);

  const filteredItems = selectedCategory
    ? foodItems.filter(
        (item) => item.categoryId === selectedCategory && item.isAvailable
      )
    : foodItems.filter((item) => item.isAvailable);

  const getFoodItemsInCart = () => {
    const foodItemCounts: { [key: number]: number } = {};

    cartItems.forEach((item) => {
      if (item.type === "food") {
        if (!foodItemCounts[item.id]) {
          foodItemCounts[item.id] = 0;
        }
        foodItemCounts[item.id]++;
      }
    });

    return foodItemCounts;
  };

  const foodItemsInCart = getFoodItemsInCart();

  const foodItemsCount = Object.values(foodItemsInCart).reduce(
    (sum, count) => sum + count,
    0
  );

  const handleAddToCart = (item: FoodItem) => {
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      type: "food",
      showtimeId: showtimeId ? parseInt(showtimeId) : 0,
      seatId: item.id,
      seatLabel: item.name,
      ticketType: "food",
    };

    addToCart(cartItem);

    setAddedToCart((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));

    setTimeout(() => {
      setAddedToCart((prev) => {
        const newState = { ...prev };
        delete newState[item.id];
        return newState;
      });
    }, 2000);
  };

  const handleRemoveFromCart = (foodId: number) => {
    const index = cartItems.findIndex(
      (item) => item.type === "food" && item.id === foodId
    );

    if (index !== -1) {
      removeFromCart(index);
    }
  };

  const handleCheckout = () => {
    if (showtimeId) {
      navigate(`/payment/${showtimeId}`);
    } else {
      navigate("/checkout");
    }
  };

  const handleRetry = () => {
    setRetryCount(0);
    setError(null);
  };

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
          <p>
            Enhance your movie experience with our delicious food and drinks
          </p>
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

      <div className="concessions-content">
        <div className="categories-menu">
          <h2>Menu</h2>
          <div className="category-tabs">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-tab ${
                  selectedCategory === category.id ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category.id)}>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="food-items-grid">
          {filteredItems.length === 0 ? (
            <div className="no-items">No items available in this category</div>
          ) : (
            filteredItems.map((item) => (
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
                  {foodItemsInCart[item.id] > 0 && (
                    <div className="quantity-badge">
                      {foodItemsInCart[item.id]}
                    </div>
                  )}
                </div>
                <div className="food-info">
                  <h3 className="food-name">{item.name}</h3>
                  <p className="food-description">
                    {item.description || "No description available"}
                  </p>
                  <div className="food-price-action">
                    <span className="food-price">${item.price.toFixed(2)}</span>
                    <div className="quantity-controls">
                      {foodItemsInCart[item.id] > 0 && (
                        <button
                          className="remove-btn"
                          onClick={() => handleRemoveFromCart(item.id)}>
                          -
                        </button>
                      )}
                      <button
                        className={`add-to-cart ${
                          addedToCart[item.id] ? "added" : ""
                        }`}
                        onClick={() => handleAddToCart(item)}>
                        {foodItemsInCart[item.id] > 0 ? "+" : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {foodItemsCount > 0 && (
          <div className="checkout-bar">
            <div className="checkout-summary">
              <span className="items-count">
                {foodItemsCount} item{foodItemsCount !== 1 ? "s" : ""} in cart
              </span>
              <span className="total-amount">Total: ${total.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              {showtimeId ? "Continue to Payment" : "Checkout"}
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ConcessionsPage;
