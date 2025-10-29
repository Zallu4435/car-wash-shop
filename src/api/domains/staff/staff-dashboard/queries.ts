import { useQuery } from '@tanstack/react-query';
import { staffDashboardFetchers } from './fetchers';

export const staffDashboardKeys = {
  all: ['staff-dashboard'] as const,
  summary: () => [...staffDashboardKeys.all, 'summary'] as const,
  upcomingJobs: () => [...staffDashboardKeys.all, 'upcoming-jobs'] as const,
};

export const useStaffDashboardSummary = () => {
  return useQuery({
    queryKey: staffDashboardKeys.summary(),
    queryFn: staffDashboardFetchers.getDashboardSummary,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useStaffUpcomingJobs = () => {
  return useQuery({
    queryKey: staffDashboardKeys.upcomingJobs(),
    queryFn: staffDashboardFetchers.getUpcomingJobs,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};