import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminOrdersFetchers } from './fetchers';
import type { OrderFilters, UpdateOrderStatusInput } from '@/types/admin';
import { toast } from 'sonner';

export const adminOrdersKeys = {
  all: ['admin-orders'] as const,
  list: (filters?: OrderFilters) => [...adminOrdersKeys.all, 'list', filters] as const,
  detail: (id: string) => [...adminOrdersKeys.all, 'detail', id] as const,
};

export const useAdminOrderList = (filters?: OrderFilters) => {
  return useQuery({
    queryKey: adminOrdersKeys.list(filters),
    queryFn: () => adminOrdersFetchers.getOrderList(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
    placeholderData: (previousData) => previousData,
  });
};

export const useAdminOrderDetail = (orderId: string) => {
  return useQuery({
    queryKey: adminOrdersKeys.detail(orderId),
    queryFn: () => adminOrdersFetchers.getOrderById(orderId),
    enabled: !!orderId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, input }: { orderId: string; input: UpdateOrderStatusInput }) =>
      adminOrdersFetchers.updateOrderStatus(orderId, input),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(adminOrdersKeys.detail(variables.orderId), data);
      queryClient.invalidateQueries({ queryKey: adminOrdersKeys.all });
      toast.success('Order status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update order status');
    },
  });
};
