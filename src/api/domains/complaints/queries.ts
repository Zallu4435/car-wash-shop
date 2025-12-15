import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { complaintFetchers } from './fetchers';
import type { CreateComplaintInput } from '@/types/complaint';
import { toast } from 'sonner';

export const complaintKeys = {
    all: ['complaints'] as const,
    byReference: (referenceType: string, referenceId: string) =>
        [...complaintKeys.all, 'byReference', referenceType, referenceId] as const,
    canFile: (referenceType: string, referenceId: string) =>
        [...complaintKeys.all, 'canFile', referenceType, referenceId] as const,
};

/**
 * Get complaint for a specific order/booking
 */
export const useComplaintByReference = (
    referenceType: 'booking' | 'productOrder',
    referenceId: string
) => {
    return useQuery({
        queryKey: complaintKeys.byReference(referenceType, referenceId),
        queryFn: () => complaintFetchers.getComplaintByReference(referenceType, referenceId),
        enabled: !!referenceId,
        staleTime: 30 * 1000, // 30 seconds
    });
};

/**
 * Check if user can file a complaint
 */
export const useCanFileComplaint = (
    referenceType: 'booking' | 'productOrder',
    referenceId: string
) => {
    return useQuery({
        queryKey: complaintKeys.canFile(referenceType, referenceId),
        queryFn: () => complaintFetchers.canFileComplaint(referenceType, referenceId),
        enabled: !!referenceId,
        staleTime: 60 * 1000, // 1 minute
    });
};

/**
 * Create a new complaint
 */
export const useCreateComplaint = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (input: CreateComplaintInput) =>
            complaintFetchers.createComplaint(input),
        onSuccess: (data, variables) => {
            // Invalidate related queries
            queryClient.invalidateQueries({
                queryKey: complaintKeys.byReference(variables.referenceType, variables.referenceId)
            });
            queryClient.invalidateQueries({
                queryKey: complaintKeys.canFile(variables.referenceType, variables.referenceId)
            });
            toast.success('Complaint submitted successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to submit complaint');
        },
    });
};
