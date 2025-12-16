import { useQuery } from '@tanstack/react-query';
import { staffPaymentsFetchers, PaymentFilter } from './fetchers';

// Query keys
export const staffPaymentsKeys = {
    all: ['staff-payments'] as const,
    payments: (date: string, filter: PaymentFilter) =>
        [...staffPaymentsKeys.all, 'payments', date, filter] as const,
    summary: (days: number) =>
        [...staffPaymentsKeys.all, 'summary', days] as const,
};

/**
 * Get payments for a specific date
 */
export function useStaffPayments(date: string, filter: PaymentFilter = 'all') {
    return useQuery({
        queryKey: staffPaymentsKeys.payments(date, filter),
        queryFn: () => staffPaymentsFetchers.getPayments(date, filter),
        staleTime: 30 * 1000, // 30 seconds
    });
}

/**
 * Get payment summary for past days
 */
export function useStaffPaymentsSummary(days: number = 7) {
    return useQuery({
        queryKey: staffPaymentsKeys.summary(days),
        queryFn: () => staffPaymentsFetchers.getSummary(days),
        staleTime: 60 * 1000, // 1 minute
    });
}
