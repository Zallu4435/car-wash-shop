import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authFetchers } from './fetchers';
import { getAccessToken, setAccessToken as setGlobalAccessToken } from '@/state/authState';
import type { RegisterInput } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { CustomerRoutes } from '@/lib/constants/routes';
import { cartKeys } from '../cart/queries';

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

export const useSendOtp = () => {
  return useMutation({
    mutationFn: (phone: string) => authFetchers.sendOtp(phone),
  });
};

export const useVerifyOtp = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ phone, otp }: { phone: string; otp: string }) =>
      authFetchers.verifyOtp(phone, otp),
    onSuccess: (data) => {
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

export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: RegisterInput) => authFetchers.register(input),
    onSuccess: (data) => {
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
