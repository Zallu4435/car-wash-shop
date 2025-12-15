import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCustomersFetchers, CustomerListParams } from './fetchers';
import { toast } from 'sonner';

export const adminCustomersKeys = {
  all: ['admin-customers'] as const,
  list: (params: CustomerListParams) => [...adminCustomersKeys.all, 'list', params] as const,
  detail: (id: string) => [...adminCustomersKeys.all, 'detail', id] as const,
};

export const useAdminCustomerList = (params: CustomerListParams = {}) => {
  return useQuery({
    queryKey: adminCustomersKeys.list(params),
    queryFn: () => adminCustomersFetchers.getCustomerList(params),
    staleTime: 1 * 60 * 1000,
  });
};

export const useAdminCustomerDetail = (customerId: string) => {
  return useQuery({
    queryKey: adminCustomersKeys.detail(customerId),
    queryFn: () => adminCustomersFetchers.getCustomerById(customerId),
    enabled: !!customerId,
    staleTime: 1 * 60 * 1000,
  });
};

export const useUpdateCustomerStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, status }: { customerId: string; status: 'active' | 'suspended' }) =>
      adminCustomersFetchers.updateCustomerStatus(customerId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminCustomersKeys.all });
      const action = variables.status === 'suspended' ? 'blocked' : 'unblocked';
      toast.success(`Customer ${action} successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update customer status');
    },
  });
};
