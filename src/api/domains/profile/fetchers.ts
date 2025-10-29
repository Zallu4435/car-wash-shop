import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type {
  UserProfile,
  UpdateProfileInput,
  ChangePasswordInput,
} from '@/types/profile';
import { CustomerRoutes } from '@/lib/constants/routes';

export const profileFetchers = {
  async getProfile(): Promise<UserProfile> {
    const { data } = await apiClient.get<ApiResponse<UserProfile>>(CustomerRoutes.PROFILE);
    return data.data!;
  },

  async updateProfile(input: UpdateProfileInput): Promise<UserProfile> {
    const { data } = await apiClient.patch<ApiResponse<UserProfile>>(
      CustomerRoutes.PROFILE,
      input
    );
    return data.data!;
  },

  async changePassword(input: ChangePasswordInput): Promise<{ message: string }> {
    const { data } = await apiClient.patch<ApiResponse<{ message: string }>>(
      CustomerRoutes.PROFILE_SECURITY,
      input
    );
    return data.data!;
  },

  async deleteAccount(): Promise<{ message: string }> {
    const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
      CustomerRoutes.PROFILE_DELETE
    );
    return data.data!;
  },
};
