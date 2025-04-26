// src/pages/BookingPage/BookingModal/BookingModal.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import { BookingModalProps } from '../../../types/BookingModalProps';
import './BookingModal.css';

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onContinueToPayment,
  onOrderConcessions,
  total
}) => {
  const navigate = useNavigate(); // Add navigate hook

  if (!isOpen) return null;

  // Update handler to use navigate for more reliable routing
  const handleOrderConcessions = () => {
    // Call the original handler if provided
    if (onOrderConcessions) {
      onOrderConcessions();
    } else {
      // Get showtime ID from URL if needed
      const showtimeId = window.location.pathname.split('/').pop();
      navigate(`/concessions/${showtimeId}`);
    }
    onClose(); // Close the modal
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal-container">
        <div className="modal-content">
          <div className="modal-header">
            <h2>How would you like to proceed?</h2>
            <button className="modal-close" onClick={onClose}>&times;</button>
          </div>
          
          <div className="modal-body">
            <p className="modal-subtitle">Your tickets total: ${total.toFixed(2)}</p>
            
            <div className="modal-options">
              <div className="option-card" onClick={handleOrderConcessions}>
                <div className="option-icon">🍿</div>
                <h3>Add Concessions</h3>
                <p>Order snacks and drinks for your movie</p>
                <span className="option-tag">Optional</span>
              </div>
              
              <div className="option-card" onClick={onContinueToPayment}>
                <div className="option-icon">💳</div>
                <h3>Continue to Payment</h3>
                <p>Pay for your tickets only</p>
                <span className="option-tag">Quick checkout</span>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <p className="modal-note">You can always add concessions later at the theater</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingModal;