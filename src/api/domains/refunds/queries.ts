import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { refundFetchers } from './fetchers';
import { toast } from 'sonner';

export const refundKeys = {
    all: ['admin-refunds'] as const,
    lists: () => [...refundKeys.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...refundKeys.lists(), filters] as const,
    stats: () => [...refundKeys.all, 'stats'] as const,
};

export const useAdminRefunds = (params?: {
    status?: 'pending' | 'processed' | 'all';
    fromDate?: string;
    toDate?: string;
    page?: number;
    limit?: number;
}) => {
    return useQuery({
        queryKey: refundKeys.list(params),
        queryFn: () => refundFetchers.getRefunds(params),
        staleTime: 30 * 1000,
    });
};

export const useAdminRefundStats = () => {
    return useQuery({
        queryKey: refundKeys.stats(),
        queryFn: () => refundFetchers.getRefundStats(),
        staleTime: 60 * 1000,
    });
};

export const useMarkRefunded = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (bookingId: string) => refundFetchers.markRefunded(bookingId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: refundKeys.all });
            toast.success('Refund marked as processed');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to mark refund as processed');
        },
    });
};
