import { BookingStatus, PaymentStatus } from '@/lib/constants/status';

export interface Order {
    id: string;
    bookingId: string;
    userId: string;
    status: BookingStatus;
    serviceName: string;
    serviceImage?: string;
    scheduledAt: string;
    completedAt?: string;
    totalAmount: number;
    paymentStatus: PaymentStatus;
    paymentMethod?: string;
    invoiceUrl?: string;
    feedback?: OrderFeedback;
    vehicleDetails?: {
      type: string;
      model: string;
      number: string;
    };
    addressDetails?: string;
    createdAt: string;
    updatedAt: string;
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
    type?: 'service' | 'product';
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
  