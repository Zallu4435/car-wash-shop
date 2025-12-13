import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface UpdateProfileInput {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
}

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Mock data
const mockAdminProfile: AdminProfile = {
  id: 'admin-1',
  name: 'Admin User',
  email: 'admin@carwash.com',
  phone: '+91 98765 43210',
  role: 'Super Admin',
  avatar: '/images/avatars/default-avatar.svg',
  createdAt: '2024-01-01T00:00:00Z',
  lastLogin: new Date().toISOString(),
};

const mockNotificationPrefs: NotificationPreferences = {
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false,
};

export const adminProfileFetchers = {
  async getProfile(): Promise<AdminProfile> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockAdminProfile;
    }

    const { data } = await apiClient.get<ApiResponse<AdminProfile>>('/admin/profile');
    return data.data!;
  },

  async updateProfile(input: UpdateProfileInput): Promise<AdminProfile> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        ...mockAdminProfile,
        ...input,
      };
    }

    const { data } = await apiClient.put<ApiResponse<AdminProfile>>(
      '/admin/profile',
      input
    );
    return data.data!;
  },

  async changePassword(input: ChangePasswordInput): Promise<{ message: string }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return { message: 'Password changed successfully' };
    }

    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      '/admin/profile/change-password',
      input
    );
    return data.data!;
  },

  async getNotificationPreferences(): Promise<NotificationPreferences> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockNotificationPrefs;
    }

    const { data } = await apiClient.get<ApiResponse<NotificationPreferences>>(
      '/admin/profile/notification-preferences'
    );
    return data.data!;
  },

  async updateNotificationPreferences(
    preferences: NotificationPreferences
  ): Promise<NotificationPreferences> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return preferences;
    }

    const { data} = await apiClient.put<ApiResponse<NotificationPreferences>>(
      '/admin/profile/notification-preferences',
      preferences
    );
    return data.data!;
  },

  async uploadAvatar(file: File): Promise<{ url: string }> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { url: '/images/avatars/default-avatar.svg' };
    }

    const formData = new FormData();
    formData.append('avatar', file);

    const { data } = await apiClient.post<ApiResponse<{ url: string }>>(
      '/admin/profile/upload-avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data.data!;
  },
};
