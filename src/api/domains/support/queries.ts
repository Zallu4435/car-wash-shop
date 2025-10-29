import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supportFetchers } from './fetchers';
import type { CreateTicketInput } from '@/types/support';
import { toast } from 'sonner';

export const supportKeys = {
  all: ['support'] as const,
  tickets: () => [...supportKeys.all, 'tickets'] as const,
  ticket: (id: string) => [...supportKeys.tickets(), id] as const,
  messages: (ticketId: string) => [...supportKeys.ticket(ticketId), 'messages'] as const,
  topics: () => [...supportKeys.all, 'topics'] as const,
};

export const useTickets = () => {
  return useQuery({
    queryKey: supportKeys.tickets(),
    queryFn: supportFetchers.getTickets,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useTicket = (ticketId: string) => {
  return useQuery({
    queryKey: supportKeys.ticket(ticketId),
    queryFn: () => supportFetchers.getTicketById(ticketId),
    enabled: !!ticketId,
  });
};

export const useTicketMessages = (ticketId: string) => {
  return useQuery({
    queryKey: supportKeys.messages(ticketId),
    queryFn: () => supportFetchers.getTicketMessages(ticketId),
    enabled: !!ticketId,
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  });
};

export const useTopics = () => {
  return useQuery({
    queryKey: supportKeys.topics(),
    queryFn: supportFetchers.getTopics,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTicketInput) => supportFetchers.createTicket(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supportKeys.tickets() });
      toast.success('Support ticket created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create ticket');
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, message }: { ticketId: string; message: string }) =>
      supportFetchers.sendMessage(ticketId, message),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: supportKeys.messages(variables.ticketId),
      });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send message');
    },
  });
};
