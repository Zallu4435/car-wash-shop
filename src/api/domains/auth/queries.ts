import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authFetchers } from './fetchers';
import { tokenManager } from '@/api/client';
import type { RegisterInput, LoginInput } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { AdminRoutes, StaffRoutes, CustomerRoutes } from '@/lib/constants/routes';

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'current-user'] as const,
};

// Queries
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: authFetchers.getCurrentUser,
    enabled: !!tokenManager.getToken(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

// Mutations
export const useSendOtp = () => {
  return useMutation({
    mutationFn: (phone: string) => authFetchers.sendOtp(phone),
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: ({ phone, otp }: { phone: string; otp: string }) =>
      authFetchers.verifyOtp(phone, otp),
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: RegisterInput) => authFetchers.register(input),
    onSuccess: (data) => {
      // Save tokens
      tokenManager.setToken(data.token);
      if (data.refreshToken) {
        tokenManager.setRefreshToken(data.refreshToken);
      }
      // Set lightweight cookies for middleware
      if (typeof document !== 'undefined') {
        document.cookie = `auth_token=${data.token}; path=/`;
        document.cookie = `auth_role=${data.user.role}; path=/`;
      }
      
      // Update cache with user data
      queryClient.setQueryData(authKeys.currentUser(), data.user);
      
      // Redirect by role
      if (data.user.role === 'admin') router.push(AdminRoutes.DASHBOARD);
      else if (data.user.role === 'staff') router.push(StaffRoutes.DASHBOARD);
      else router.push(CustomerRoutes.HOME);
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: LoginInput) => authFetchers.login(input),
    onSuccess: (data) => {
      // Save tokens
      tokenManager.setToken(data.token);
      if (data.refreshToken) {
        tokenManager.setRefreshToken(data.refreshToken);
      }
      // Set lightweight cookies for middleware
      if (typeof document !== 'undefined') {
        document.cookie = `auth_token=${data.token}; path=/`;
        document.cookie = `auth_role=${data.user.role}; path=/`;
      }
      
      // Update cache with user data
      queryClient.setQueryData(authKeys.currentUser(), data.user);
      
      // Redirect by role
      if (data.user.role === 'admin') router.push(AdminRoutes.DASHBOARD);
      else if (data.user.role === 'staff') router.push(StaffRoutes.DASHBOARD);
      else router.push(CustomerRoutes.HOME);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (phone: string) => authFetchers.forgotPassword(phone),
  });
};

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      phone,
      otp,
      password,
      confirmPassword,
    }: {
      phone: string;
      otp: string;
      password: string;
      confirmPassword: string;
    }) => authFetchers.resetPassword(phone, otp, password, confirmPassword),
    onSuccess: () => {
      router.push('/login');
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authFetchers.logout,
    onSuccess: () => {
      // Clear tokens
      tokenManager.clearTokens();
      // Clear cookies used by middleware
      if (typeof document !== 'undefined') {
        document.cookie = 'auth_token=; Max-Age=0; path=/';
        document.cookie = 'auth_role=; Max-Age=0; path=/';
      }
      
      // Clear all queries
      queryClient.clear();
      
      // Redirect to generic login
      router.push(CustomerRoutes.LOGIN);
    },
  });
};

// Role-specific admin logout that redirects to admin login
export const useAdminLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: authFetchers.logout,
    onSuccess: () => {
      tokenManager.clearTokens();
      if (typeof document !== 'undefined') {
        document.cookie = 'auth_token=; Max-Age=0; path=/';
        document.cookie = 'auth_role=; Max-Age=0; path=/';
      }
      queryClient.clear();
      router.push(AdminRoutes.LOGIN);
    },
  });
};
