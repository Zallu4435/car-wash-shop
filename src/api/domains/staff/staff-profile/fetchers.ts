import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type {
  StaffProfile,
  UpdateStaffProfileInput,
  StaffNotification,
} from '@/types/staff';
import { StaffRoutes } from '@/lib/constants/routes';

export const staffProfileFetchers = {
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
