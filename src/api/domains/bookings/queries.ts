import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingFetchers } from './fetchers';
import type { BookingInput, BookingFilters } from '@/types/booking';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Query Keys
export const bookingKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  list: (filters?: BookingFilters) => [...bookingKeys.lists(), filters] as const,
  details: () => [...bookingKeys.all, 'detail'] as const,
  detail: (id: string) => [...bookingKeys.details(), id] as const,
  preview: () => [...bookingKeys.all, 'preview'] as const,
  availableDays: (serviceId: string) =>
    [...bookingKeys.all, 'availableDays', serviceId] as const,
  slots: (serviceId: string, date: string) =>
    [...bookingKeys.all, 'slots', serviceId, date] as const,
};

// Queries
export const useBookings = (filters?: BookingFilters) => {
  return useQuery({
    queryKey: bookingKeys.list(filters),
    queryFn: () => bookingFetchers.getUserBookings(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useBooking = (bookingId: string) => {
  return useQuery({
    queryKey: bookingKeys.detail(bookingId),
    queryFn: () => bookingFetchers.getBookingById(bookingId),
    enabled: !!bookingId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useAvailableDays = (serviceId: string, daysAhead?: number) => {
  return useQuery({
    queryKey: bookingKeys.availableDays(serviceId),
    queryFn: () => bookingFetchers.getAvailableDays(serviceId, daysAhead),
    enabled: !!serviceId,
    staleTime: 1 * 60 * 1000, // 1 minute - reduced to get fresher data
    refetchOnMount: true, // Always refetch when component mounts
  });
};

export const useAvailableSlots = (serviceId: string, date: string) => {
  return useQuery({
    queryKey: bookingKeys.slots(serviceId, date),
    queryFn: () => bookingFetchers.getAvailableSlots(serviceId, date),
    enabled: !!serviceId && !!date,
    staleTime: 0, // Always consider data stale to get latest slots
    refetchOnMount: true, // Always refetch when component mounts
  });
};

export const useBookingPreview = () => {
  return useMutation({
    mutationFn: (input: Partial<BookingInput>) =>
      bookingFetchers.getBookingPreview(input),
  });
};

// Mutations
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: BookingInput) => bookingFetchers.createBooking(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      toast.success('Booking created successfully!');
      // Redirect to success page with service flag
      router.push(`/payment/receipt?serviceId=${data.id}&service=true`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create booking');
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => bookingFetchers.cancelBooking(bookingId),
    onSuccess: (data, bookingId) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(bookingId) });
      toast.success('Booking cancelled successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cancel booking');
    },
  });
};

export const useSubmitBookingFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, rating, comment }: { bookingId: string; rating: number; comment?: string }) =>
      bookingFetchers.submitFeedback(bookingId, { rating, comment }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(variables.bookingId) });
      toast.success('Thank you for your feedback!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit feedback');
    },
  });
};
