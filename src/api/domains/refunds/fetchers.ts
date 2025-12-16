import { apiClient } from '@/api/client';

export interface RefundItem {
    id: string;
    bookingId: string;
    customer: {
        name: string;
        email: string;
        phone: string;
    };
    service: string;
    amount: number;
    refund: {
        eligible: boolean;
        amount: number;
        reason: string;
        status: 'none' | 'pending' | 'processed';
        requestedAt?: string;
        processedAt?: string;
    };
    cancelledAt: string;
    createdAt: string;
}

export interface RefundsResponse {
    data: RefundItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface RefundStats {
    pending: {
        count: number;
        amount: number;
    };
    processed: {
        count: number;
        amount: number;
    };
}

export const refundFetchers = {
    async getRefunds(params?: {
        status?: 'pending' | 'processed' | 'all';
        fromDate?: string;
        toDate?: string;
        page?: number;
        limit?: number;
    }): Promise<RefundsResponse> {
        const searchParams = new URLSearchParams();
        if (params?.status) searchParams.append('status', params.status);
        if (params?.fromDate) searchParams.append('fromDate', params.fromDate);
        if (params?.toDate) searchParams.append('toDate', params.toDate);
        if (params?.page) searchParams.append('page', String(params.page));
        if (params?.limit) searchParams.append('limit', String(params.limit));

        const query = searchParams.toString();
        const response = await apiClient.get(`/admin/refunds${query ? `?${query}` : ''}`);
        return response.data.data;
    },

    async getRefundStats(): Promise<RefundStats> {
        const response = await apiClient.get('/admin/refunds/stats');
        return response.data.data;
    },

    async markRefunded(bookingId: string): Promise<{ message: string }> {
        const response = await apiClient.post(`/admin/refunds/${bookingId}/process`);
        return response.data;
    },
};
