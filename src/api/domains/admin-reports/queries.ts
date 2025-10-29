import { useQuery } from '@tanstack/react-query';
import { adminReportsFetchers } from './fetchers';

export const adminReportsKeys = {
  all: ['admin-reports'] as const,
  revenue: (fromDate?: string, toDate?: string) => 
    [...adminReportsKeys.all, 'revenue', fromDate, toDate] as const,
  staffPerformance: (fromDate?: string, toDate?: string) => 
    [...adminReportsKeys.all, 'staff-performance', fromDate, toDate] as const,
  service: (fromDate?: string, toDate?: string) => 
    [...adminReportsKeys.all, 'service', fromDate, toDate] as const,
};

export const useRevenueReport = (fromDate?: string, toDate?: string) => {
  return useQuery({
    queryKey: adminReportsKeys.revenue(fromDate, toDate),
    queryFn: () => adminReportsFetchers.getRevenueReport(fromDate, toDate),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useStaffPerformanceReport = (fromDate?: string, toDate?: string) => {
  return useQuery({
    queryKey: adminReportsKeys.staffPerformance(fromDate, toDate),
    queryFn: () => adminReportsFetchers.getStaffPerformanceReport(fromDate, toDate),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useServiceReport = (fromDate?: string, toDate?: string) => {
  return useQuery({
    queryKey: adminReportsKeys.service(fromDate, toDate),
    queryFn: () => adminReportsFetchers.getServiceReport(fromDate, toDate),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
