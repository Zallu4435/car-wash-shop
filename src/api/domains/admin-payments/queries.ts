import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminPaymentFetchers } from './fetchers';
import { toast } from 'sonner';

export const adminPaymentKeys = {
  all: ['admin-payments'] as const,
  transactions: (filters?: any) => [...adminPaymentKeys.all, 'transactions', filters] as const,
  report: (fromDate?: string, toDate?: string) => 
    [...adminPaymentKeys.all, 'report', fromDate, toDate] as const,
};

export const usePaymentTransactions = (filters?: { 
  search?: string;
  status?: string; 
  method?: string;
  dateRange?: string;
}) => {
  return useQuery({
    queryKey: adminPaymentKeys.transactions(filters),
    queryFn: () => adminPaymentFetchers.getPaymentTransactions(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const usePaymentReport = (fromDate?: string, toDate?: string) => {
  return useQuery({
    queryKey: adminPaymentKeys.report(fromDate, toDate),
    queryFn: () => adminPaymentFetchers.getPaymentReport(fromDate, toDate),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useVerifyTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transactionId: string) => adminPaymentFetchers.verifyTransaction(transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminPaymentKeys.all });
      toast.success('Transaction verified successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to verify transaction');
    },
  });
};
