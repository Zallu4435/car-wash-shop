import { useQuery } from '@tanstack/react-query';
import { staffPaymentsFetchers } from './fetchers';

export const staffPaymentsKeys = {
  all: ['staff-payments'] as const,
  summary: () => [...staffPaymentsKeys.all, 'summary'] as const,
};

export const useStaffPaymentSummary = () => {
  return useQuery({
    queryKey: staffPaymentsKeys.summary(),
    queryFn: staffPaymentsFetchers.getPaymentSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
