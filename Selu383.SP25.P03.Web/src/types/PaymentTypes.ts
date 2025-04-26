export interface PaymentRequest {
  amount: number;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  paymentMethod: string;
  reservationId?: number;
}

export interface PaymentResult {
  success: boolean;
  paymentId: string;
  message: string;
  status: PaymentStatus;
}

export enum PaymentStatus {
  Pending = 'Pending',
  Successful = 'Successful',
  Failed = 'Failed',
  Refunded = 'Refunded'
}