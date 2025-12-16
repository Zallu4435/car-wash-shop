import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';

// Types for staff payments
export interface PaymentTransaction {
    id: string;
    time: string;
    customer: string;
    service: string;
    amount: number;
    totalAmount: number;
    advanceAmount: number;
    method: 'cash' | 'online' | 'unknown';
}

export interface PaymentsTotals {
    cash: number;
    online: number;
    total: number;
}

export interface StaffPaymentsResponse {
    date: string;
    transactions: PaymentTransaction[];
    totals: PaymentsTotals;
    handoverStatus: 'pending' | 'received';
    handoverReceivedAt: string | null;
}

export interface PaymentSummaryItem {
    date: string;
    cash: number;
    online: number;
    total: number;
    count: number;
    handoverStatus: 'pending' | 'received';
}

export type PaymentFilter = 'all' | 'cash' | 'online';

export const staffPaymentsFetchers = {
    /**
     * Get payments for a specific date with optional filter
     */
    async getPayments(date: string, filter: PaymentFilter = 'all'): Promise<StaffPaymentsResponse> {
        const { data } = await apiClient.get<ApiResponse<StaffPaymentsResponse>>(
            '/staff/payments',
            { params: { date, filter } }
        );
        return data.data!;
    },

    /**
     * Get payment summary for past days
     */
    async getSummary(days: number = 7): Promise<PaymentSummaryItem[]> {
        const { data } = await apiClient.get<ApiResponse<PaymentSummaryItem[]>>(
            '/staff/payments/summary',
            { params: { days } }
        );
        return data.data!;
    },
};
