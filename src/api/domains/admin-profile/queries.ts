import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminProfileFetchers } from './fetchers';
import type { UpdateProfileInput, ChangePasswordInput, NotificationPreferences } from './fetchers';

export const ADMIN_PROFILE_KEYS = {
  all: ['admin-profile'] as const,
  profile: () => [...ADMIN_PROFILE_KEYS.all, 'profile'] as const,
  notificationPrefs: () => [...ADMIN_PROFILE_KEYS.all, 'notification-prefs'] as const,
};

export function useAdminProfile() {
  return useQuery({
    queryKey: ADMIN_PROFILE_KEYS.profile(),
    queryFn: () => adminProfileFetchers.getProfile(),
  });
}

export function useUpdateAdminProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => adminProfileFetchers.updateProfile(input),
    onSuccess: (data) => {
      queryClient.setQueryData(ADMIN_PROFILE_KEYS.profile(), data);
      queryClient.invalidateQueries({ queryKey: ADMIN_PROFILE_KEYS.all });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => adminProfileFetchers.changePassword(input),
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: ADMIN_PROFILE_KEYS.notificationPrefs(),
    queryFn: () => adminProfileFetchers.getNotificationPreferences(),
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (preferences: NotificationPreferences) =>
      adminProfileFetchers.updateNotificationPreferences(preferences),
    onSuccess: (data) => {
      queryClient.setQueryData(ADMIN_PROFILE_KEYS.notificationPrefs(), data);
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => adminProfileFetchers.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PROFILE_KEYS.profile() });
    },
  });
}
