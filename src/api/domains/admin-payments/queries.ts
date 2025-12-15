import { useQuery } from '@tanstack/react-query';
import {
    adminPaymentsFetchers,
    type PaymentFilters,
    type PaymentsResponse,
    type PaymentsSummary,
    type PaymentsAnalytics,
} from './fetchers';

// Query keys
export const adminPaymentsKeys = {
    all: ['admin-payments'] as const,
    list: (filters: PaymentFilters) => [...adminPaymentsKeys.all, 'list', filters] as const,
    summary: (filters: PaymentFilters) => [...adminPaymentsKeys.all, 'summary', filters] as const,
    analytics: (filters: PaymentFilters) => [...adminPaymentsKeys.all, 'analytics', filters] as const,
};

/**
 * Hook to fetch payments list
 */
export function usePayments(filters: PaymentFilters = {}) {
    return useQuery<PaymentsResponse, Error>({
        queryKey: adminPaymentsKeys.list(filters),
        queryFn: () => adminPaymentsFetchers.getPayments(filters),
        staleTime: 1000 * 60, // 1 minute
    });
}

/**
 * Hook to fetch payment summary
 */
export function usePaymentsSummary(filters: PaymentFilters = {}) {
    return useQuery<PaymentsSummary, Error>({
        queryKey: adminPaymentsKeys.summary(filters),
        queryFn: () => adminPaymentsFetchers.getSummary(filters),
        staleTime: 1000 * 60, // 1 minute
    });
}

/**
 * Hook to fetch payment analytics
 */
export function usePaymentsAnalytics(filters: PaymentFilters = {}) {
    return useQuery<PaymentsAnalytics, Error>({
        queryKey: adminPaymentsKeys.analytics(filters),
        queryFn: () => adminPaymentsFetchers.getAnalytics(filters),
        staleTime: 1000 * 60, // 1 minute
    });
}

// Re-export types and fetchers
export * from './fetchers';
