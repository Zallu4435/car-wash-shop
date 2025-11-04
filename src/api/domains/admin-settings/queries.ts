import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminSettingsFetchers } from './fetchers';
import type {
  DeliverySettings,
  PaymentSettings,
  UpdateAdminProfileInput,
} from '@/types/admin';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { setAccessToken } from '@/state/authState';
import { AdminRoutes } from '@/lib/constants/routes';

export const adminSettingsKeys = {
  all: ['admin-settings'] as const,
  delivery: () => [...adminSettingsKeys.all, 'delivery'] as const,
  payment: () => [...adminSettingsKeys.all, 'payment'] as const,
  profile: () => [...adminSettingsKeys.all, 'profile'] as const,
  notifications: () => [...adminSettingsKeys.all, 'notifications'] as const,
};

// Delivery Settings
export const useDeliverySettings = () => {
  return useQuery({
    queryKey: adminSettingsKeys.delivery(),
    queryFn: adminSettingsFetchers.getDeliverySettings,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUpdateDeliverySettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: DeliverySettings) => adminSettingsFetchers.updateDeliverySettings(input),
    onSuccess: (data) => {
      queryClient.setQueryData(adminSettingsKeys.delivery(), data);
      toast.success('Delivery settings updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update delivery settings');
    },
  });
};

// Payment Settings
export const usePaymentSettings = () => {
  return useQuery({
    queryKey: adminSettingsKeys.payment(),
    queryFn: adminSettingsFetchers.getPaymentSettings,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUpdatePaymentSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PaymentSettings) => adminSettingsFetchers.updatePaymentSettings(input),
    onSuccess: (data) => {
      queryClient.setQueryData(adminSettingsKeys.payment(), data);
      toast.success('Payment settings updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update payment settings');
    },
  });
};

// Profile
export const useAdminProfile = () => {
  return useQuery({
    queryKey: adminSettingsKeys.profile(),
    queryFn: adminSettingsFetchers.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateAdminProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateAdminProfileInput) => adminSettingsFetchers.updateProfile(input),
    onSuccess: (data) => {
      queryClient.setQueryData(adminSettingsKeys.profile(), data);
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
};

export const useAdminLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: adminSettingsFetchers.logout,
    onSuccess: () => {
      setAccessToken(null);
      queryClient.clear();
      toast.success('Logged out successfully');
      router.push(AdminRoutes.LOGIN);
    },
  });
};

// Notifications
export const useAdminNotifications = () => {
  return useQuery({
    queryKey: adminSettingsKeys.notifications(),
    queryFn: adminSettingsFetchers.getNotifications,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) => adminSettingsFetchers.markNotificationAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminSettingsKeys.notifications() });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminSettingsFetchers.markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminSettingsKeys.notifications() });
      toast.success('All notifications marked as read');
    },
  });
};

// General Settings (alias for payment settings)
export const useAdminSettings = () => {
  return usePaymentSettings();
};

export const useUpdateSettings = () => {
  return useUpdatePaymentSettings();
};
