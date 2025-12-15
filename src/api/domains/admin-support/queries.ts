import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminSupportFetchers } from './fetchers';
import { toast } from 'sonner';

export const adminSupportKeys = {
  all: ['admin-support'] as const,
  feedback: (filters?: {
    search?: string;
    type?: string;
    rating?: string;
    page?: number;
    pageSize?: number;
  }) => [...adminSupportKeys.all, 'feedback', filters] as const,
};

// Feedback
export const useAdminFeedbackList = (filters?: {
  search?: string;
  type?: string;
  rating?: string;
  page?: number;
  pageSize?: number;
}) => {
  // Convert pageSize to limit for the API
  const apiFilters = filters ? {
    ...filters,
    limit: filters.pageSize,
    pageSize: undefined,
  } : undefined;

  return useQuery({
    queryKey: adminSupportKeys.feedback(filters),
    queryFn: () => adminSupportFetchers.getFeedbackList(apiFilters as any),
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: (previousData) => previousData,
  });
};

export const useUpdateFeedbackStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ feedbackId, status }: { feedbackId: string; status: 'pending' | 'reviewed' | 'resolved' }) =>
      adminSupportFetchers.updateFeedbackStatus(feedbackId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...adminSupportKeys.all, 'feedback'] });
      toast.success('Feedback status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update feedback status');
    },
  });
};
