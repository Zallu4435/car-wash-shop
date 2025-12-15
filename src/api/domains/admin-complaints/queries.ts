import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminComplaintFetchers } from './fetchers';
import type { AdminComplaintFilters, ResolveComplaintInput } from '@/types/admin';
import { toast } from 'sonner';

export const adminComplaintKeys = {
    all: ['admin-complaints'] as const,
    lists: () => [...adminComplaintKeys.all, 'list'] as const,
    list: (filters?: AdminComplaintFilters) =>
        [...adminComplaintKeys.lists(), filters] as const,
    details: () => [...adminComplaintKeys.all, 'detail'] as const,
    detail: (id: string) => [...adminComplaintKeys.details(), id] as const,
};

/**
 * Get all complaints with filters and pagination
 */
export const useAdminComplaints = (filters?: AdminComplaintFilters) => {
    return useQuery({
        queryKey: adminComplaintKeys.list(filters),
        queryFn: () => adminComplaintFetchers.getComplaints(filters),
        staleTime: 30 * 1000, // 30 seconds
        placeholderData: (previousData) => previousData,
    });
};

/**
 * Get complaint by ID
 */
export const useAdminComplaintDetail = (id: string) => {
    return useQuery({
        queryKey: adminComplaintKeys.detail(id),
        queryFn: () => adminComplaintFetchers.getComplaintById(id),
        enabled: !!id,
        staleTime: 30 * 1000,
    });
};

/**
 * Resolve a complaint
 */
export const useResolveComplaint = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: ResolveComplaintInput }) =>
            adminComplaintFetchers.resolveComplaint(id, input),
        onSuccess: (data, variables) => {
            // Update the detail cache
            queryClient.setQueryData(
                adminComplaintKeys.detail(variables.id),
                data
            );
            // Invalidate list queries
            queryClient.invalidateQueries({
                queryKey: adminComplaintKeys.lists()
            });
            toast.success('Complaint updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update complaint');
        },
    });
};
