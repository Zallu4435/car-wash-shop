import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminSupportFetchers } from './fetchers';
import type { UpdateTicketStatusInput, AddTicketMessageInput } from '@/types/admin';
import { toast } from 'sonner';

export const adminSupportKeys = {
  all: ['admin-support'] as const,
  feedback: () => [...adminSupportKeys.all, 'feedback'] as const,
  tickets: () => [...adminSupportKeys.all, 'tickets'] as const,
  ticketsList: () => [...adminSupportKeys.tickets(), 'list'] as const,
  ticketDetail: (id: string) => [...adminSupportKeys.tickets(), 'detail', id] as const,
};

// Feedback
export const useAdminFeedbackList = () => {
  return useQuery({
    queryKey: adminSupportKeys.feedback(),
    queryFn: adminSupportFetchers.getFeedbackList,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUpdateFeedbackStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ feedbackId, status }: { feedbackId: string; status: 'pending' | 'reviewed' | 'resolved' }) =>
      adminSupportFetchers.updateFeedbackStatus(feedbackId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminSupportKeys.feedback() });
      toast.success('Feedback status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update feedback status');
    },
  });
};

// Tickets
export const useAdminTicketList = () => {
  return useQuery({
    queryKey: adminSupportKeys.ticketsList(),
    queryFn: adminSupportFetchers.getTicketList,
    staleTime: 1 * 60 * 1000, // 1 minute
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
