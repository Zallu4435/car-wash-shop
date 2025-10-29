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
import { mockCustomerProfile } from '@/mocks/data/customer-mock-data';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

// Mock authenticated user
const mockAuthUser: AuthUser = {
  id: mockCustomerProfile.id,
  name: mockCustomerProfile.name,
  email: mockCustomerProfile.email || '',
  phone: mockCustomerProfile.phone,
  role: 'customer',
  avatar: mockCustomerProfile.avatar,
  isVerified: true,
};

// Mock token
const MOCK_TOKEN = 'mock_jwt_token_12345';

export const authFetchers = {
  async sendOtp(phone: string): Promise<OtpResponse> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { message: 'OTP sent successfully. Use 123456 to login.' };
    }
    
    const { data } = await apiClient.post<ApiResponse<OtpResponse>>(
      CustomerRoutes.AUTH_SEND_OTP,
      { phone }
    );
    return data.data!;
  },

  async verifyOtp(phone: string, otp: string): Promise<MessageResponse> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (otp === '123456') {
        return { message: 'OTP verified successfully' };
      }
      throw new Error('Invalid OTP');
    }
    
    const { data } = await apiClient.post<ApiResponse<MessageResponse>>(
      CustomerRoutes.AUTH_VERIFY_OTP,
      { phone, otp }
    );
    return data.data!;
  },

  async register(input: RegisterInput): Promise<AuthResponse> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      // Create new user based on input
      const newUser: AuthUser = {
        id: `user_${Date.now()}`,
        name: input.name,
        phone: input.phone,
        email: input.email,
        role: 'customer',
        isVerified: true,
      };
      return {
        user: newUser,
        token: MOCK_TOKEN,
        refreshToken: 'mock_refresh_token',
      };
    }
    
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      CustomerRoutes.AUTH_REGISTER,
      input
    );
    return data.data!;
  },

  async login(input: LoginInput): Promise<AuthResponse> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      // Mock login - accept any phone with OTP "123456"
      if (input.otp === '123456') {
        return {
          user: mockAuthUser,
          token: MOCK_TOKEN,
          refreshToken: 'mock_refresh_token',
        };
      }
      throw new Error('Invalid OTP');
    }
    
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
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockAuthUser;
    }
    
    const { data} = await apiClient.get<ApiResponse<AuthUser>>(
      CustomerRoutes.AUTH_ME
    );
    return data.data!;
  },

  async logout(): Promise<MessageResponse> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { message: 'Logged out successfully' };
    }
    
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
