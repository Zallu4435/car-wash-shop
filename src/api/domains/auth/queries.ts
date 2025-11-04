import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authFetchers } from './fetchers';
import { tokenManager } from '@/api/client';
import type { RegisterInput } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { CustomerRoutes } from '@/lib/constants/routes';

export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'current-user'] as const,
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: authFetchers.getCurrentUser,
    enabled: !!tokenManager.getToken(),
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
      tokenManager.setToken(data.token);
      queryClient.setQueryData(authKeys.currentUser(), data.user);
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
      tokenManager.setToken(data.token);
      queryClient.setQueryData(authKeys.currentUser(), data.user);
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
      tokenManager.clearToken();
      queryClient.clear();
      router.push(CustomerRoutes.LOGIN);
    },
  });
};
