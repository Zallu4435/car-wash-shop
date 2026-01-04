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

  async sendEmailOtp(email: string): Promise<OtpResponse> {
    const { data } = await apiClient.post<ApiResponse<OtpResponse>>(
      '/auth/email/send-otp',
      { email }
    );
    return data.data!;
  },

  async verifyEmailOtp(
    email: string,
    otp: string
  ): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/email/verify',
      { email, otp }
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

  async loginWithCredentials(identifier: string, password: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      { identifier, password }
    );
    return data.data!;
  },

  async sendPasswordResetOTP(identifier: string): Promise<OtpResponse> {
    const { data } = await apiClient.post<ApiResponse<OtpResponse>>(
      '/auth/password/reset/send-otp',
      { identifier }
    );
    return data.data!;
  },

  async resetPasswordWithOTP(identifier: string, otp: string, newPassword: string): Promise<MessageResponse> {
    const { data } = await apiClient.post<ApiResponse<MessageResponse>>(
      '/auth/password/reset',
      { identifier, otp, newPassword }
    );
    return data.data!;
  },
};
