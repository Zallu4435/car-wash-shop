export interface CheckoutSessionInput {
    bookingId: string;
    paymentType: 'full' | 'advance';
    amount: number;
  }
  
  export interface CheckoutSession {
    sessionId: string;
    paymentUrl: string;
    expiresAt: string;
    bookingId: string;
    amount: number;
  }
  
  export interface PaymentSuccessInput {
    sessionId: string;
    transactionId: string;
    paymentMethod: string;
  }
  
  export interface PaymentFailureInput {
    sessionId: string;
    errorCode?: string;
    errorMessage?: string;
  }
  
  export interface PaymentResponse {
    success: boolean;
    bookingId: string;
    message: string;
  }
  