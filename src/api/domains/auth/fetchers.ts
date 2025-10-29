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
import { CustomerRoutes } from '@/lib/constants/routes';

export const authFetchers = {
  async sendOtp(phone: string): Promise<OtpResponse> {
    const { data } = await apiClient.post<ApiResponse<OtpResponse>>(
      CustomerRoutes.AUTH_SEND_OTP,
      { phone }
    );
    return data.data!;
  },

  async verifyOtp(phone: string, otp: string): Promise<MessageResponse> {
    const { data } = await apiClient.post<ApiResponse<MessageResponse>>(
      CustomerRoutes.AUTH_VERIFY_OTP,
      { phone, otp }
    );
    return data.data!;
  },

  async register(input: RegisterInput): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      CustomerRoutes.AUTH_REGISTER,
      input
    );
    return data.data!;
  },

  async login(input: LoginInput): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      CustomerRoutes.AUTH_LOGIN,
      input
    );
    return data.data!;
  },

  async forgotPassword(phone: string): Promise<OtpResponse> {
    const { data } = await apiClient.post<ApiResponse<OtpResponse>>(
      CustomerRoutes.AUTH_FORGOT_PASSWORD,
      { phone }
    );
    return data.data!;
  },

  async resetPassword(
    phone: string,
    otp: string,
    password: string,
    confirmPassword: string
  ): Promise<MessageResponse> {
    const { data } = await apiClient.post<ApiResponse<MessageResponse>>(
      CustomerRoutes.AUTH_RESET_PASSWORD,
      { phone, otp, password, confirmPassword }
    );
    return data.data!;
  },

  async getCurrentUser(): Promise<AuthUser> {
    const { data } = await apiClient.get<ApiResponse<AuthUser>>(
      CustomerRoutes.AUTH_ME
    );
    return data.data!;
  },

  async logout(): Promise<MessageResponse> {
    const { data } = await apiClient.post<ApiResponse<MessageResponse>>(
      CustomerRoutes.AUTH_LOGOUT
    );
    return data.data!;
  },

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const { data } = await apiClient.post<ApiResponse<{ token: string }>>(
      CustomerRoutes.AUTH_REFRESH,
      { refreshToken }
    );
    return data.data!;
  },
};
