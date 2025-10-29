import { apiClient } from '@/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Notification, NotificationFilters } from '@/types/notification';
import { CustomerRoutes } from '@/lib/constants/routes';

export const notificationFetchers = {
  async getNotifications(
    filters?: NotificationFilters
  ): Promise<PaginatedResponse<Notification>> {
    const { data } = await apiClient.get<
      ApiResponse<PaginatedResponse<Notification>>
    >(CustomerRoutes.NOTIFICATIONS, { params: filters });
    return data.data!;
  },

  async markAsRead(notificationId: string): Promise<{ message: string }> {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      `${CustomerRoutes.NOTIFICATIONS}/${notificationId}/${CustomerRoutes.NOTIFICATIONS_READ}`
    );
    return data.data!;
  },

  async markAllAsRead(): Promise<{ message: string }> {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      `${CustomerRoutes.NOTIFICATIONS}/${CustomerRoutes.NOTIFICATIONS_READ_ALL}`
    );
    return data.data!;
  },
};
