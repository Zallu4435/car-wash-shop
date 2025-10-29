import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCODFetchers } from './fetchers';
import { toast } from 'sonner';

export const adminCODKeys = {
  all: ['admin-cod'] as const,
  transactions: (filters?: any) => [...adminCODKeys.all, 'transactions', filters] as const,
  report: (fromDate?: string, toDate?: string) => 
    [...adminCODKeys.all, 'report', fromDate, toDate] as const,
};

export const useCODTransactions = (filters?: { status?: string; staffId?: string }) => {
  return useQuery({
    queryKey: adminCODKeys.transactions(filters),
    queryFn: () => adminCODFetchers.getCODTransactions(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useCODReport = (fromDate?: string, toDate?: string) => {
  return useQuery({
    queryKey: adminCODKeys.report(fromDate, toDate),
    queryFn: () => adminCODFetchers.getCODReport(fromDate, toDate),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useVerifyCODTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transactionId: string) => adminCODFetchers.verifyCODTransaction(transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCODKeys.all });
      toast.success('COD transaction verified successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to verify COD transaction');
    },
  });
};
