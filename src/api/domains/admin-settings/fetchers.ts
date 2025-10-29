import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type {
  DeliverySettings,
  PaymentSettings,
  AdminProfile,
  UpdateAdminProfileInput,
  AdminNotification,
} from '@/types/admin';
import { AdminRoutes } from '@/lib/constants/routes';

export const adminSettingsFetchers = {
  // Delivery Settings
  async getDeliverySettings(): Promise<DeliverySettings> {
    const { data } = await apiClient.get<ApiResponse<DeliverySettings>>(
      AdminRoutes.SETTINGS_DELIVERY
    );
    return data.data!;
  },

  async updateDeliverySettings(input: DeliverySettings): Promise<DeliverySettings> {
    const { data } = await apiClient.patch<ApiResponse<DeliverySettings>>(
      AdminRoutes.SETTINGS_DELIVERY,
      input
    );
    return data.data!;
  },

  // Payment Settings
  async getPaymentSettings(): Promise<PaymentSettings> {
    const { data } = await apiClient.get<ApiResponse<PaymentSettings>>(
      AdminRoutes.SETTINGS_PAYMENT
    );
    return data.data!;
  },

  async updatePaymentSettings(input: PaymentSettings): Promise<PaymentSettings> {
    const { data } = await apiClient.patch<ApiResponse<PaymentSettings>>(
      AdminRoutes.SETTINGS_PAYMENT,
      input
    );
    return data.data!;
  },

  // Profile
  async getProfile(): Promise<AdminProfile> {
    const { data } = await apiClient.get<ApiResponse<AdminProfile>>(
      AdminRoutes.PROFILE
    );
    return data.data!;
  },

  async updateProfile(input: UpdateAdminProfileInput): Promise<AdminProfile> {
    const { data } = await apiClient.patch<ApiResponse<AdminProfile>>(
      AdminRoutes.PROFILE,
      input
    );
    return data.data!;
  },

  async logout(): Promise<{ message: string }> {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      '/admin/logout'
    );
    return data.data!;
  },

  // Notifications
  async getNotifications(): Promise<AdminNotification[]> {
    const { data } = await apiClient.get<ApiResponse<AdminNotification[]>>(
      AdminRoutes.NOTIFICATIONS
    );
    return data.data!;
  },

  async markNotificationAsRead(notificationId: string): Promise<{ message: string }> {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      `${AdminRoutes.NOTIFICATIONS}/${notificationId}/read`
    );
    return data.data!;
  },

  async markAllNotificationsAsRead(): Promise<{ message: string }> {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      `${AdminRoutes.NOTIFICATIONS}/read-all`
    );
    return data.data!;
  },
};
