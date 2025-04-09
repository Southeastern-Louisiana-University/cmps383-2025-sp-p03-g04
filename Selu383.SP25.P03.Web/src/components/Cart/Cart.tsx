import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../../contexts/CartContext';
import './Cart.css';

const Cart: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const { cartItems, removeFromCart, total } = useCart();

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckout = () => {
    // To be implemented in future
    setIsOpen(false);
  };

  const handleViewCart = () => {
    // To be implemented in future
    setIsOpen(false);
  };

  return (
    <div className="cart-container" ref={cartRef}>
      <button 
        className="cart-button" 
        onClick={toggleCart}
        aria-label="Shopping cart"
        aria-expanded={isOpen}
      >
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
                {cartItems.map((item, index) => (
                  <div key={index} className="cart-item">
                    <div className="item-details">
                      <span className="seat-label">Seat {item.seatLabel}</span>
                      <span className="ticket-type">{item.ticketType}</span>
                    </div>
                    <div className="item-actions">
                      <span className="item-price">${item.price.toFixed(2)}</span>
                      <button 
                        className="remove-item" 
                        onClick={() => removeFromCart(index)}
                        aria-label={`Remove seat ${item.seatLabel} from cart`}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}

                <div className="cart-total">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          <div className="cart-actions">
            {cartItems.length > 0 && (
              <>
                <button className="checkout-btn" onClick={handleCheckout}>
                  Checkout
                </button>
                <button className="view-cart-btn" onClick={handleViewCart}>
                  View Full Cart
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;