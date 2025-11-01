import { PaymentStatus, PaymentMethod } from '@/lib/constants/status';

export interface Payment {
    id: string;
    userId: string;
    bookingId?: string;
    orderId?: string;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    transactionId?: string;
    gateway: string;
    refundAmount?: number;
    refundReason?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface PaymentFilters {
    status?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
  }
  