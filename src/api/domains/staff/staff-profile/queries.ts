import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffProfileFetchers } from './fetchers';
import type { UpdateStaffProfileInput } from '@/types/staff';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { tokenManager } from '@/api/client';
import { StaffRoutes } from '@/lib/constants/routes';

export const staffProfileKeys = {
  all: ['staff-profile'] as const,
  profile: () => [...staffProfileKeys.all, 'profile'] as const,
  notifications: () => [...staffProfileKeys.all, 'notifications'] as const,
};

export const useStaffProfile = () => {
  return useQuery({
    queryKey: staffProfileKeys.profile(),
    queryFn: staffProfileFetchers.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateStaffProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateStaffProfileInput) => staffProfileFetchers.updateProfile(input),
    onSuccess: (data) => {
      queryClient.setQueryData(staffProfileKeys.profile(), data);
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
};

export const useStaffLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: staffProfileFetchers.logout,
    onSuccess: () => {
      tokenManager.clearTokens();
      queryClient.clear();
      toast.success('Logged out successfully');
      router.push(StaffRoutes.LOGIN);
    },
  });
};

export const useStaffNotifications = () => {
  return useQuery({
    queryKey: staffProfileKeys.notifications(),
    queryFn: staffProfileFetchers.getNotifications,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

export const useMarkStaffNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) => staffProfileFetchers.markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: staffProfileKeys.notifications() });
    },
  });
};
