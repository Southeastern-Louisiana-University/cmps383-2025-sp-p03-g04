export interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContinueToPayment: () => void;
    onOrderConcessions: () => void;
    total: number;
  }
  