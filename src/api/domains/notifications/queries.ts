import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationFetchers } from './fetchers';
import type { NotificationFilters } from '@/types/notification';

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (filters?: NotificationFilters) =>
    [...notificationKeys.lists(), filters] as const,
};

export const useNotifications = (filters?: NotificationFilters) => {
  return useQuery({
    queryKey: notificationKeys.list(filters),
    queryFn: () => notificationFetchers.getNotifications(filters),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute for real-time updates
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationFetchers.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationFetchers.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    },
  });
};
