import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCustomersFetchers } from './fetchers';
import { toast } from 'sonner';

export const adminCustomersKeys = {
  all: ['admin-customers'] as const,
  detail: (id: string) => [...adminCustomersKeys.all, 'detail', id] as const,
};

export const useAdminCustomerDetail = (customerId: string) => {
  return useQuery({
    queryKey: adminCustomersKeys.detail(customerId),
    queryFn: () => adminCustomersFetchers.getCustomerById(customerId),
    enabled: !!customerId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useUpdateCustomerStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, status }: { customerId: string; status: 'active' | 'inactive' | 'blocked' }) =>
      adminCustomersFetchers.updateCustomerStatus(customerId, status),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(adminCustomersKeys.detail(variables.customerId), data);
      queryClient.invalidateQueries({ queryKey: adminCustomersKeys.all });
      toast.success('Customer status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update customer status');
    },
  });
};
