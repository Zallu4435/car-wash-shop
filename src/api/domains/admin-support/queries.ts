import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminSupportFetchers } from './fetchers';
import type { UpdateTicketStatusInput, AddTicketMessageInput } from '@/types/admin';
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
  tickets: () => [...adminSupportKeys.all, 'tickets'] as const,
  ticketsList: (filters?: {
    search?: string;
    status?: string;
    priority?: string;
    page?: number;
    pageSize?: number;
  }) => [...adminSupportKeys.tickets(), 'list', filters] as const,
  ticketDetail: (id: string) => [...adminSupportKeys.tickets(), 'detail', id] as const,
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

// Tickets
export const useAdminTicketList = (filters?: {
  search?: string;
  status?: string;
  priority?: string;
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
    queryKey: adminSupportKeys.ticketsList(filters),
    queryFn: () => adminSupportFetchers.getTicketList(apiFilters as any),
    staleTime: 1 * 60 * 1000, // 1 minute
    placeholderData: (previousData) => previousData,
  });
};

export const useAdminTicketDetail = (ticketId: string) => {
  return useQuery({
    queryKey: adminSupportKeys.ticketDetail(ticketId),
    queryFn: () => adminSupportFetchers.getTicketById(ticketId),
    enabled: !!ticketId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, input }: { ticketId: string; input: UpdateTicketStatusInput }) =>
      adminSupportFetchers.updateTicketStatus(ticketId, input),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(adminSupportKeys.ticketDetail(variables.ticketId), data);
      queryClient.invalidateQueries({ queryKey: adminSupportKeys.tickets() });
      toast.success('Ticket status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update ticket status');
    },
  });
};

export const useAddTicketMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, input }: { ticketId: string; input: AddTicketMessageInput }) =>
      adminSupportFetchers.addTicketMessage(ticketId, input),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(adminSupportKeys.ticketDetail(variables.ticketId), data);
      toast.success('Message sent successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send message');
    },
  });
};
