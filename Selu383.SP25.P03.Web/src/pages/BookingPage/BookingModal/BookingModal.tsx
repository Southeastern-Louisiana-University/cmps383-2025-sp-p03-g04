import React from 'react';
import { BookingModalProps } from '../../../types/BookingModalProps';
import './BookingModal.css';


const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  onContinueToPayment,
  onOrderConcessions,
  total
}) => {
  if (!isOpen) return null;

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
              <div className="option-card" onClick={onOrderConcessions}>
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