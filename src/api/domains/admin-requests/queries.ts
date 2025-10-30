import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminRequestsFetchers } from './fetchers';
import type { BookingFilters, AssignStaffInput } from '@/types/admin';
import { toast } from 'sonner';

export const adminRequestsKeys = {
  all: ['admin-requests'] as const,
  list: (filters?: BookingFilters) => [...adminRequestsKeys.all, 'list', filters] as const,
  detail: (id: string) => [...adminRequestsKeys.all, 'detail', id] as const,
};

export const useAdminBookingList = (filters?: BookingFilters) => {
  return useQuery({
    queryKey: adminRequestsKeys.list(filters),
    queryFn: () => adminRequestsFetchers.getBookingList(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
    placeholderData: (previousData) => previousData,
  });
};

export const useAdminBookingDetail = (bookingId: string) => {
  return useQuery({
    queryKey: adminRequestsKeys.detail(bookingId),
    queryFn: () => adminRequestsFetchers.getBookingById(bookingId),
    enabled: !!bookingId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useAssignStaffToBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, input }: { bookingId: string; input: AssignStaffInput }) =>
      adminRequestsFetchers.assignStaffToBooking(bookingId, input),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(adminRequestsKeys.detail(variables.bookingId), data);
      queryClient.invalidateQueries({ queryKey: adminRequestsKeys.all });
      toast.success('Staff assigned successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to assign staff');
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, status, note }: { bookingId: string; status: string; note?: string }) =>
      adminRequestsFetchers.updateBookingStatus(bookingId, status, note),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(adminRequestsKeys.detail(variables.bookingId), data);
      queryClient.invalidateQueries({ queryKey: adminRequestsKeys.all });
      toast.success('Booking status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update booking status');
    },
  });
};

// Slots Management
export const useAdminSlots = () => {
  return useQuery({
    queryKey: [...adminRequestsKeys.all, 'slots'],
    queryFn: () => adminRequestsFetchers.getSlots(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useBlockSlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slotId: string) => adminRequestsFetchers.blockSlot(slotId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...adminRequestsKeys.all, 'slots'] });
      toast.success('Slot blocked successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to block slot');
    },
  });
};

export const useUnblockSlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slotId: string) => adminRequestsFetchers.unblockSlot(slotId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...adminRequestsKeys.all, 'slots'] });
      toast.success('Slot unblocked successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to unblock slot');
    },
  });
};
