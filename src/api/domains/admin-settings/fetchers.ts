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

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Mock data
const mockDeliverySettings: DeliverySettings = {
  baseDeliveryFee: 50,
  freeDeliveryThreshold: 500,
  deliveryRadius: 10,
  estimatedDeliveryTime: '30-45 minutes',
};

const mockPaymentSettings: PaymentSettings = {
  enableCOD: true,
  enableOnline: true,
  enableWallet: true,
  codCharges: 0,
  paymentGateway: 'Razorpay',
};

const mockAdminProfile: AdminProfile = {
  id: 'ADMIN001',
  name: 'Admin User',
  email: 'admin@carwash.com',
  phone: '+91 98765 00000',
  role: 'Super Admin',
  permissions: ['all'],
};

const mockNotifications: AdminNotification[] = [
  {
    id: 'NOT001',
    title: 'New Order Received',
    message: 'Order #ORD001 has been placed',
    type: 'order',
    read: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'NOT002',
    title: 'New Booking',
    message: 'Booking #BK001 has been confirmed',
    type: 'booking',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

export const adminSettingsFetchers = {
  // Delivery Settings
  async getDeliverySettings(): Promise<DeliverySettings> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockDeliverySettings;
    }

    const { data } = await apiClient.get<ApiResponse<DeliverySettings>>(
      AdminRoutes.SETTINGS_DELIVERY
    );
    return data.data!;
  },

  async updateDeliverySettings(input: DeliverySettings): Promise<DeliverySettings> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { ...mockDeliverySettings, ...input };
    }

    const { data } = await apiClient.patch<ApiResponse<DeliverySettings>>(
      AdminRoutes.SETTINGS_DELIVERY,
      input
    );
    return data.data!;
  },

  // Payment Settings
  async getPaymentSettings(): Promise<PaymentSettings> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockPaymentSettings;
    }

    const { data } = await apiClient.get<ApiResponse<PaymentSettings>>(
      AdminRoutes.SETTINGS_PAYMENT
    );
    return data.data!;
  },

  async updatePaymentSettings(input: PaymentSettings): Promise<PaymentSettings> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { ...mockPaymentSettings, ...input };
    }

    const { data } = await apiClient.patch<ApiResponse<PaymentSettings>>(
      AdminRoutes.SETTINGS_PAYMENT,
      input
    );
    return data.data!;
  },

  // Profile
  async getProfile(): Promise<AdminProfile> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockAdminProfile;
    }

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
      '/auth/logout'
    );
    return data.data!;
  },

  // Notifications
  async getNotifications(): Promise<AdminNotification[]> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockNotifications;
    }

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
