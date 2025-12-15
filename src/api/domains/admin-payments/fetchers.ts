import { apiClient } from '@/api/client';

// Payments API routes
const PAYMENTS_BASE = '/admin/payments';

// Types
export interface PaymentFilters {
    preset?: 'today' | 'week' | 'month' | 'year' | 'all';
    startDate?: string;
    endDate?: string;
    status?: string;
    type?: 'order' | 'booking';
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface PaymentItem {
    id: string;
    type: 'order' | 'booking';
    referenceId: string;
    referenceNumber: string;
    customerId: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    amount: number;
    totalAmount?: number;
    paymentStatus: string;
    paymentMethod: string;
    paymentType?: string;
    transactionId: string | null;
    razorpayOrderId: string | null;
    serviceName?: string;
    createdAt: string;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface PaymentsResponse {
    payments: PaymentItem[];
    pagination: Pagination;
}

export interface PaymentsSummary {
    totalTransactions: number;
    totalRevenue: number;
    averageValue: number;
    paidCount: number;
    pendingCount: number;
    refundedCount: number;
    refundedAmount: number;
    orderCount: number;
    bookingCount: number;
    advancePayments: number;
    fullPayments: number;
}

export interface RevenueDataPoint {
    label: string;
    orders: number;
    bookings: number;
    total: number;
}

export interface PaymentMethodBreakdown {
    method: string;
    count: number;
    amount: number;
}

export interface PaymentsAnalytics {
    revenueData: RevenueDataPoint[];
    paymentMethods: PaymentMethodBreakdown[];
    period: string;
}

// Helper to build query string
const buildQueryParams = (filters: PaymentFilters): Record<string, string> => {
    const params: Record<string, string> = {};
    if (filters.preset) params.preset = filters.preset;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.status) params.status = filters.status;
    if (filters.type) params.type = filters.type;
    if (filters.search) params.search = filters.search;
    if (filters.sortBy) params.sortBy = filters.sortBy;
    if (filters.sortOrder) params.sortOrder = filters.sortOrder;
    if (filters.page) params.page = String(filters.page);
    if (filters.limit) params.limit = String(filters.limit);
    return params;
};

export const adminPaymentsFetchers = {
    /**
     * Get paginated payments list
     */
    async getPayments(filters: PaymentFilters = {}): Promise<PaymentsResponse> {
        const { data } = await apiClient.get<PaymentsResponse>(
            PAYMENTS_BASE,
            { params: buildQueryParams(filters) }
        );
        return data;
    },

    /**
     * Get payment summary statistics
     */
    async getSummary(filters: PaymentFilters = {}): Promise<PaymentsSummary> {
        const { data } = await apiClient.get<PaymentsSummary>(
            `${PAYMENTS_BASE}/summary`,
            { params: buildQueryParams(filters) }
        );
        return data;
    },

    /**
     * Get payment analytics for charts
     */
    async getAnalytics(filters: PaymentFilters = {}): Promise<PaymentsAnalytics> {
        const { data } = await apiClient.get<PaymentsAnalytics>(
            `${PAYMENTS_BASE}/analytics`,
            { params: buildQueryParams(filters) }
        );
        return data;
    },
};
