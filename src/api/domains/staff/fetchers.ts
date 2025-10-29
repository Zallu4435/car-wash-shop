import { apiClient } from '@/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  StaffDashboardSummary,
  StaffJob,
  StaffJobDetail,
  StaffJobFilters,
  UpdateJobStatusInput,
  StaffPaymentSummary,
  StaffProfile,
  UpdateStaffProfileInput,
  StaffNotification,
} from '@/types/staff';
import { StaffRoutes } from '@/lib/constants/routes';

export const staffFetchers = {
  // Dashboard
  async getDashboardSummary(): Promise<StaffDashboardSummary> {
    const { data } = await apiClient.get<ApiResponse<StaffDashboardSummary>>(
      StaffRoutes.DASHBOARD + '/summary'
    );
    return data.data!;
  },

  async getUpcomingJobs(): Promise<StaffJob[]> {
    const { data } = await apiClient.get<ApiResponse<StaffJob[]>>(
      StaffRoutes.JOBS + '/upcoming'
    );
    return data.data!;
  },

  // Jobs
  async getJobs(filters?: StaffJobFilters): Promise<PaginatedResponse<StaffJob>> {
    const { data } = await apiClient.get<ApiResponse<PaginatedResponse<StaffJob>>>(
      StaffRoutes.JOBS,
      { params: filters }
    );
    return data.data!;
  },

  async getJobById(jobId: string): Promise<StaffJobDetail> {
    const { data } = await apiClient.get<ApiResponse<StaffJobDetail>>(
      StaffRoutes.JOB_DETAIL(jobId)
    );
    return data.data!;
  },

  async updateJobStatus(
    jobId: string,
    input: UpdateJobStatusInput
  ): Promise<StaffJobDetail> {
    const { data } = await apiClient.patch<ApiResponse<StaffJobDetail>>(
      StaffRoutes.JOB_DETAIL(jobId),
      input
    );
    return data.data!;
  },

  // Payments
  async getPaymentSummary(): Promise<StaffPaymentSummary> {
    const { data } = await apiClient.get<ApiResponse<StaffPaymentSummary>>(
      StaffRoutes.PAYMENTS + '/summary'
    );
    return data.data!;
  },

  // History
  async getWorkHistory(filters?: StaffJobFilters): Promise<StaffJob[]> {
    const { data } = await apiClient.get<ApiResponse<StaffJob[]>>(
      StaffRoutes.HISTORY,
      { params: filters }
    );
    return data.data!;
  },

  // Profile
  async getProfile(): Promise<StaffProfile> {
    const { data } = await apiClient.get<ApiResponse<StaffProfile>>(
      StaffRoutes.PROFILE
    );
    return data.data!;
  },

  async updateProfile(input: UpdateStaffProfileInput): Promise<StaffProfile> {
    const { data } = await apiClient.patch<ApiResponse<StaffProfile>>(
      StaffRoutes.PROFILE,
      input
    );
    return data.data!;
  },

  async logout(): Promise<{ message: string }> {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      StaffRoutes.LOGOUT
    );
    return data.data!;
  },

  // Notifications
  async getNotifications(): Promise<StaffNotification[]> {
    const { data } = await apiClient.get<ApiResponse<StaffNotification[]>>(
      StaffRoutes.NOTIFICATIONS
    );
    return data.data!;
  },

  async markNotificationAsRead(notificationId: string): Promise<{ message: string }> {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      StaffRoutes.MARK_NOTIFICATION_AS_READ,
      { notificationId }
    );
    return data.data!;
  },
};
