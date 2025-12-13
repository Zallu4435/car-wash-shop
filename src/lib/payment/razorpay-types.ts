// Razorpay Payment Options
export interface RazorpayOptions {
  key: string;
  amount: number; // Amount in paise (multiply by 100)
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color: string;
  };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

// Razorpay Success Response
export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Razorpay Error Response
export interface RazorpayErrorResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id: string;
    };
  };
}

// Create Order Request
export interface CreateOrderRequest {
  amount: number; // Amount in rupees (will be converted to paise)
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

// Create Order Response
export interface CreateOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

// Verify Payment Request
export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Verify Payment Response
export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  paymentId?: string;
  orderId?: string;
}

// Payment Details for UI
export interface ProductOrderPaymentItem {
  productId: string;
  quantity: number;
}

export interface ProductOrderPaymentPayload {
  items: ProductOrderPaymentItem[];
  addressId: string;
  discount?: number;
  tax?: number;
  shippingFee?: number;
  source?: string;
  notes?: string;
}

export interface PaymentDetails {
  amount: number;
  description: string;
  orderId?: string;
  bookingId?: string; // Deprecated - use bookingData instead
  bookingData?: {
    serviceId: string;
    serviceName?: string;
    vehicleId: string;
    slotId: string;
    addressId: string;
    addOns?: string[];
    couponCode?: string;
    paymentType: 'full' | 'advance';
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  productOrder?: ProductOrderPaymentPayload; // Product checkout payload
  checkoutType?: 'service' | 'product';
  paymentType?: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
  notes?: Record<string, string>;
}

// Razorpay Instance Type
export interface RazorpayInstance {
  open(): void;
  on(event: string, callback: (response: unknown) => void): void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
