import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderFetchers } from './fetchers';
import type { CreateProductOrderInput, OrderFilters, OrderFeedbackInput } from '@/types/order';
import { toast } from 'sonner';

// Query Keys
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters?: OrderFilters) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

// Queries
export const useOrders = (filters?: OrderFilters) => {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => orderFetchers.getOrders(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => orderFetchers.getOrderById(orderId),
    enabled: !!orderId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useValidateCoupon = () => {
  return useMutation({
    mutationFn: ({ code, amount }: { code: string; amount: number }) =>
      orderFetchers.validateCoupon(code, amount),
  });
};

export const useCreateProductOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateProductOrderInput) => orderFetchers.createProductOrder(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      toast.success('Order placed successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to place order');
    },
  });
};

// Mutations
export const useDownloadInvoice = () => {
  return useMutation({
    mutationFn: (orderId: string) => orderFetchers.downloadInvoice(orderId),
    onSuccess: (blob, orderId) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Invoice downloaded successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to download invoice');
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderFetchers.cancelOrder(orderId),
    onSuccess: (data, orderId) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
      toast.success('Order cancelled successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cancel order');
    },
  });
};

export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: OrderFeedbackInput) => orderFetchers.submitFeedback(input),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.orderId),
      });
      toast.success('Thank you for your feedback!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit feedback');
    },
  });
};
