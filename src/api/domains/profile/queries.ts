import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileFetchers } from './fetchers';
import type { UpdateProfileInput, ChangePasswordInput } from '@/types/profile';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { tokenManager } from '@/api/client';

export const profileKeys = {
  all: ['profile'] as const,
};

export const useProfile = () => {
  return useQuery({
    queryKey: profileKeys.all,
    queryFn: profileFetchers.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => profileFetchers.updateProfile(input),
    onSuccess: (data) => {
      queryClient.setQueryData(profileKeys.all, data);
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) =>
      profileFetchers.changePassword(input),
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to change password');
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: profileFetchers.deleteAccount,
    onSuccess: () => {
      tokenManager.clearTokens();
      queryClient.clear();
      toast.success('Account deleted successfully');
      router.push('/');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete account');
    },
  });
};
