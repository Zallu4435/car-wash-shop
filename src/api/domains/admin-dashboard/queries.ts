import { useQuery } from '@tanstack/react-query';
import { adminDashboardFetchers } from './fetchers';

export const adminDashboardKeys = {
  all: ['admin-dashboard'] as const,
  summary: () => [...adminDashboardKeys.all, 'summary'] as const,
};

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: adminDashboardKeys.summary(),
    queryFn: adminDashboardFetchers.getDashboardSummary,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};
