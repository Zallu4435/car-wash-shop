import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';

const BASE = '/admin/login-logs';

export type LoginMethod = 'credentials' | 'google' | 'email-otp';

export interface LoginLogUser {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
}

export interface LoginLogItem {
  _id: string;
  user?: LoginLogUser;
  identifier?: string;
  method: LoginMethod;
  success: boolean;
  ip?: string;
  userAgent?: string;
  errorCode?: string | null;
  errorMessage?: string | null;
  createdAt: string;
}

export interface LoginLogsResponse {
  items: LoginLogItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GroupedLoginLogItem {
  identifier?: string;
  method: LoginMethod;
  totalAttempts: number;
  successCount: number;
  failureCount: number;
  lastAttemptAt: string;
}

export interface GroupedLoginLogsResponse {
  items: GroupedLoginLogItem[];
  pagination: {
    page: number;
    limit: number;
  };
}

export interface LoginLogFilters {
  method?: LoginMethod | 'all';
  success?: 'all' | 'true' | 'false';
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

const buildParams = (filters: LoginLogFilters = {}) => {
  const params: Record<string, string> = {};
  if (filters.method && filters.method !== 'all') params.method = filters.method;
  if (filters.success && filters.success !== 'all') params.success = filters.success;
  if (filters.from) params.from = filters.from;
  if (filters.to) params.to = filters.to;
  if (filters.page) params.page = String(filters.page);
  if (filters.limit) params.limit = String(filters.limit);
  return params;
};

export const adminLoginLogsFetchers = {
  async getLoginLogs(filters: LoginLogFilters = {}): Promise<LoginLogsResponse> {
    const { data } = await apiClient.get<ApiResponse<LoginLogsResponse>>(BASE, {
      params: buildParams(filters),
    });
    return data.data!;
  },

  async getGroupedLoginLogs(filters: LoginLogFilters = {}): Promise<GroupedLoginLogsResponse> {
    const { data } = await apiClient.get<ApiResponse<GroupedLoginLogsResponse>>(`${BASE}/grouped`, {
      params: buildParams(filters),
    });
    return data.data!;
  },
};

