import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import { useCart } from "../../contexts/CartContext";
import "./Cart.css";

const Cart: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const { cartItems, removeFromCart, total } = useCart();
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {};

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const getFirstShowtimeId = (): number | undefined => {
    const seatItem = cartItems.find((item) => item.type !== "food");
    return seatItem?.showtimeId;
  };

  const handleCheckout = () => {
    // Only navigate if we have items and a showtime ID
    const showtimeId = getFirstShowtimeId();
    if (showtimeId) {
      navigate(`/payment/${showtimeId}`);
    }
    setIsOpen(false);
  };

  const foodItems = cartItems.filter((item) => item.type === "food");
  const seatItems = cartItems.filter((item) => item.type !== "food");

  return (
    <>
      <div className="cart-container" ref={cartRef}>
        <button
          className="cart-button"
          onClick={toggleCart}
          aria-label="Shopping cart"
          aria-expanded={isOpen}>
          <i className="cart-icon">🛒</i>
          {cartItems.length > 0 && (
            <span className="cart-badge">{cartItems.length}</span>
          )}
        </button>

        {isOpen && (
          <div className="cart-dropdown">
            <div className="cart-header">
              <h3>Your Cart</h3>
              {cartItems.length > 0 && (
                <span className="item-count">{cartItems.length} item(s)</span>
              )}
            </div>

            <div className="cart-items">
              {cartItems.length === 0 ? (
                <p className="empty-cart">Your cart is empty</p>
              ) : (
                <>
                  {seatItems.length > 0 && (
                    <>
                      <div className="cart-section-heading">Tickets</div>
                      {seatItems.map((item, index) => (
                        <div key={`seat-${index}`} className="cart-item">
                          <div className="item-details">
                            <span className="seat-label">
                              Seat {item.seatLabel}
                            </span>
                            <span className="ticket-type">
                              {item.ticketType}
                            </span>
                          </div>
                          <div className="item-actions">
                            <span className="item-price">
                              ${item.price.toFixed(2)}
                            </span>
                            <button
                              className="remove-item"
                              onClick={() =>
                                removeFromCart(cartItems.indexOf(item))
                              }
                              aria-label={`Remove seat ${item.seatLabel} from cart`}>
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {foodItems.length > 0 && (
                    <>
                      <div className="cart-section-heading">Concessions</div>
                      {foodItems.map((item, index) => (
                        <div key={`food-${index}`} className="cart-item">
                          <div className="item-details">
                            <span className="food-name">{item.name}</span>
                          </div>
                          <div className="item-actions">
                            <span className="item-price">
                              ${item.price.toFixed(2)}
                            </span>
                            <button
                              className="remove-item"
                              onClick={() =>
                                removeFromCart(cartItems.indexOf(item))
                              }
                              aria-label={`Remove ${item.name} from cart`}>
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  <div className="cart-total">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            <div className="cart-actions">
              {cartItems.length > 0 && seatItems.length > 0 && (
                <>
                  <button className="checkout-btn" onClick={handleCheckout}>
                    Proceed to Payment
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
