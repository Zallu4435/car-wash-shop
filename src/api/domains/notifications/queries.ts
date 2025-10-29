import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { notificationFetchers } from './fetchers';
import type { NotificationFilters } from '@/types/notification';
import { toast } from 'sonner';

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (filters?: NotificationFilters) =>
    [...notificationKeys.lists(), filters] as const,
  infinite: (filters?: Omit<NotificationFilters, 'page'>) =>
    [...notificationKeys.lists(), 'infinite', filters] as const,
};

export const useNotifications = (filters?: NotificationFilters, enabled: boolean = true) => {
  return useQuery({
    queryKey: notificationKeys.list(filters),
    queryFn: () => notificationFetchers.getNotifications(filters),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute for real-time updates
    enabled, // Only fetch when enabled (user is authenticated)
  });
};

export const useInfiniteNotifications = (
  filters?: Omit<NotificationFilters, 'page'>,
  enabled: boolean = true
) => {
  return useInfiniteQuery({
    queryKey: notificationKeys.infinite(filters),
    queryFn: ({ pageParam = 1 }) =>
      notificationFetchers.getNotifications({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 30 * 1000,
    enabled,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationFetchers.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      toast.success('Notification marked as read');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark notification as read');
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: notificationFetchers.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      toast.success('All notifications marked as read');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to mark all as read');
    },
  });
};
