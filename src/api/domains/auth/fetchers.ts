import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type {
  AuthUser,
  RegisterInput,
  LoginInput,
  OtpResponse,
  MessageResponse,
  AuthResponse,
} from '@/types/auth';

export const authFetchers = {
  async sendOtp(phone: string): Promise<OtpResponse> {
    const { data } = await apiClient.post<ApiResponse<OtpResponse>>(
      '/auth/phone/send-otp',
      { phone }
    );
    return data.data!;
  },

  async verifyOtp(
    phone: string,
    otp: string
  ): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/phone/verify',
      { phone, otp }
    );
    return data.data!;
  },

  async register(input: RegisterInput): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      input
    );
    return data.data!;
  },

  async googleAuth(code: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/google',
      { code }
    );
    return data.data!;
  },

  async getCurrentUser(): Promise<AuthUser> {
    const { data } = await apiClient.get<ApiResponse<AuthUser>>(
      '/auth/me'
    );
    return data.data!;
  },

  async logout(): Promise<MessageResponse> {
    const { data } = await apiClient.post<ApiResponse<MessageResponse>>(
      '/auth/logout'
    );
    return data.data!;
  },
};
