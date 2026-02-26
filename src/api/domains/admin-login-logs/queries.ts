import { useQuery } from '@tanstack/react-query';
import {
  adminLoginLogsFetchers,
  type LoginLogFilters,
  type LoginLogsResponse,
  type GroupedLoginLogsResponse,
} from './fetchers';

export const adminLoginLogsKeys = {
  all: ['admin-login-logs'] as const,
  list: (filters: LoginLogFilters) => [...adminLoginLogsKeys.all, 'list', filters] as const,
  grouped: (filters: LoginLogFilters) => [...adminLoginLogsKeys.all, 'grouped', filters] as const,
};

export function useAdminLoginLogs(filters: LoginLogFilters = {}) {
  return useQuery<LoginLogsResponse, Error>({
    queryKey: adminLoginLogsKeys.list(filters),
    queryFn: () => adminLoginLogsFetchers.getLoginLogs(filters),
    keepPreviousData: true,
  });
}

export function useAdminGroupedLoginLogs(filters: LoginLogFilters = {}) {
  return useQuery<GroupedLoginLogsResponse, Error>({
    queryKey: adminLoginLogsKeys.grouped(filters),
    queryFn: () => adminLoginLogsFetchers.getGroupedLoginLogs(filters),
    keepPreviousData: true,
  });
}

export * from './fetchers';

