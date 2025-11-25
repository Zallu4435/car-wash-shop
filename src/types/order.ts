import { OrderStatus, PaymentStatus } from '@/lib/constants/status';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price?: number;
  unitPrice?: number;
  subtotal?: number;
}

export interface OrderAddress {
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  phone?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  subtotal?: number;
  discount?: number;
  tax?: number;
  shippingFee?: number;
  totalAmount: number;
  items: OrderItem[];
  deliveryAddress?: OrderAddress | string;
  trackingNumber?: string;
  meta?: Record<string, string | number | boolean | null | undefined>;
  createdAt: string;
  updatedAt: string;
  feedback?: OrderFeedback;
}

export interface OrderFeedback {
  rating: number;
  comment?: string;
  createdAt?: string;
}

export interface OrderFeedbackInput {
  orderId: string;
  rating: number;
  comment?: string;
}

export interface OrderFilters {
  status?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

export interface CouponValidation {
  code: string;
  isValid: boolean;
  discount: number;
  message?: string;
}
