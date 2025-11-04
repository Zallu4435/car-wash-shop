import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authFetchers } from './fetchers';
import { getAccessToken, setAccessToken as setGlobalAccessToken } from '@/state/authState';
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
    enabled: !!getAccessToken(),
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
