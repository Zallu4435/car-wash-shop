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

export const useRemoveStaffAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) =>
      adminRequestsFetchers.removeStaffAssignment(bookingId),
    onSuccess: (data, bookingId) => {
      queryClient.setQueryData(adminRequestsKeys.detail(bookingId), data);
      queryClient.invalidateQueries({ queryKey: adminRequestsKeys.all });
      toast.success('Staff assignment removed successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove staff assignment');
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
export const useAdminSlots = (date?: string) => {
  return useQuery({
    queryKey: [...adminRequestsKeys.all, 'slots', date],
    queryFn: () => adminRequestsFetchers.getSlots(date!),
    enabled: Boolean(date),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGenerateSlots = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { date: string; startTime: string; endTime: string; capacity?: number }) =>
      adminRequestsFetchers.createSlots(input),
    onSuccess: (data, variables) => {
      queryClient.setQueryData([...adminRequestsKeys.all, 'slots', variables.date], data);
      toast.success('Slots generated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to generate slots');
    },
  });
};

export const useUpdateSlotStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slotId, date, status }: { slotId: string; date: string; status: 'available' | 'unavailable' }) =>
      adminRequestsFetchers.updateSlot(slotId, { status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...adminRequestsKeys.all, 'slots', variables.date] });
      toast.success('Slot updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update slot');
    },
  });
};

export const useUpdateSlotsStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ date, status }: { date: string; status: 'available' | 'unavailable' }) =>
      adminRequestsFetchers.updateSlotsStatus({ date, status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [...adminRequestsKeys.all, 'slots', variables.date] });
      toast.success('Slots updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update slots');
    },
  });
};
