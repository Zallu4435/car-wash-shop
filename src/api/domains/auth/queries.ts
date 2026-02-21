import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authFetchers } from './fetchers';
import { getAccessToken, setAccessToken as setGlobalAccessToken } from '@/state/authState';
import type { AuthUser, RegisterInput } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { CustomerRoutes } from '@/lib/constants/routes';
import { cartKeys } from '../cart/queries';

// Cookie names - must match AuthContext
const COOKIE_IS_LOGGED = 'auth_is_logged';
const COOKIE_ROLE = 'auth_role';

/**
 * Sets auth cookies synchronously - MUST be called before any redirect
 * to prevent race conditions with Next.js middleware
 */
function setAuthCookies(user: AuthUser) {
  if (typeof document === 'undefined') return;
  const maxAge = 7 * 24 * 60 * 60; // 7 days
  document.cookie = `${COOKIE_IS_LOGGED}=true; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
  if (user.role) {
    document.cookie = `${COOKIE_ROLE}=${encodeURIComponent(String(user.role))}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
  }
}

/**
 * Clears auth cookies synchronously
 */
function clearAuthCookies() {
  if (typeof document === 'undefined') return;
  document.cookie = `${COOKIE_IS_LOGGED}=; Max-Age=0; Path=/; SameSite=Lax`;
  document.cookie = `${COOKIE_ROLE}=; Max-Age=0; Path=/; SameSite=Lax`;
}

export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'current-user'] as const,
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: authFetchers.getCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const useSendEmailOtp = () => {
  return useMutation({
    mutationFn: (email: string) => authFetchers.sendEmailOtp(email),
  });
};

export const useVerifyEmailOtp = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      authFetchers.verifyEmailOtp(email, otp),
    onSuccess: (data) => {
      // Set cookies FIRST (synchronously) before any other async operations
      setAuthCookies(data.user);
      setGlobalAccessToken(data.token);
      queryClient.setQueryData(authKeys.currentUser(), data.user);
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
        queryClient.refetchQueries({ queryKey: cartKeys.detail() });
      }, 0);
      router.push(CustomerRoutes.HOME);
    },
  });
};

export const useSendRegistrationOtp = () => {
  return useMutation({
    mutationFn: (email: string) => authFetchers.sendRegistrationOtp(email),
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: RegisterInput & { otp: string }) => authFetchers.register(input),
    onSuccess: (data) => {
      // Set cookies FIRST (synchronously) before any other async operations
      setAuthCookies(data.user);
      setGlobalAccessToken(data.token);
      queryClient.setQueryData(authKeys.currentUser(), data.user);
      // Invalidate and refetch cart query with new auth token
      // Using setTimeout to ensure auth context updates first
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
        queryClient.refetchQueries({ queryKey: cartKeys.detail() });
      }, 0);
      router.push(CustomerRoutes.HOME);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authFetchers.logout(),
    onSuccess: () => {
      // Clear cookies FIRST (synchronously) before any other async operations
      clearAuthCookies();
      setGlobalAccessToken(null);
      queryClient.clear();
      router.push(CustomerRoutes.LOGIN);
    },
  });
};

export const useLoginWithCredentials = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ identifier, password }: { identifier: string; password: string }) =>
      authFetchers.loginWithCredentials(identifier, password),
    onSuccess: (data) => {
      // Set cookies FIRST (synchronously) before any other async operations
      setAuthCookies(data.user);
      setGlobalAccessToken(data.token);
      queryClient.setQueryData(authKeys.currentUser(), data.user);
      // Invalidate and refetch cart query with new auth token
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: cartKeys.detail() });
        queryClient.refetchQueries({ queryKey: cartKeys.detail() });
      }, 0);
    },
  });
};

export const useSendPasswordResetOTP = () => {
  return useMutation({
    mutationFn: (identifier: string) => authFetchers.sendPasswordResetOTP(identifier),
  });
};

export const useResetPasswordWithOTP = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ identifier, otp, newPassword }: { identifier: string; otp: string; newPassword: string }) =>
      authFetchers.resetPasswordWithOTP(identifier, otp, newPassword),
    onSuccess: () => {
      // Redirect will be handled by the component using this hook
      // Components can push to appropriate route (admin/customer/staff)
    },
  });
};
