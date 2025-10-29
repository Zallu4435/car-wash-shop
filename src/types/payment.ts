export interface Payment {
    id: string;
    userId: string;
    bookingId?: string;
    orderId?: string;
    amount: number;
    method: 'card' | 'upi' | 'wallet' | 'netbanking' | 'cod';
    status: 'pending' | 'success' | 'failed' | 'refunded';
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
  