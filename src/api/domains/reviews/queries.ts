import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewFetchers, type ReviewInput } from './fetchers';
import { toast } from 'sonner';

// Query Keys
export const reviewKeys = {
  all: ['reviews'] as const,
  byOrder: (orderId: string) => [...reviewKeys.all, 'order', orderId] as const,
  byBooking: (bookingId: string) => [...reviewKeys.all, 'booking', bookingId] as const,
  byProduct: (productId: string) => [...reviewKeys.all, 'product', productId] as const,
  byService: (serviceId: string) => [...reviewKeys.all, 'service', serviceId] as const,
};

// Queries
export const useReviewByOrder = (orderId: string) => {
  return useQuery({
    queryKey: reviewKeys.byOrder(orderId),
    queryFn: () => reviewFetchers.getReviewByOrderId(orderId),
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useReviewByBooking = (bookingId: string) => {
  return useQuery({
    queryKey: reviewKeys.byBooking(bookingId),
    queryFn: () => reviewFetchers.getReviewByBookingId(bookingId),
    enabled: !!bookingId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useReviewsByProduct = (productId: string) => {
  return useQuery({
    queryKey: reviewKeys.byProduct(productId),
    queryFn: () => reviewFetchers.getReviewsByProductId(productId),
    enabled: !!productId && productId !== '',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useReviewsByService = (serviceId: string) => {
  return useQuery({
    queryKey: reviewKeys.byService(serviceId),
    queryFn: () => reviewFetchers.getReviewsByServiceId(serviceId),
    enabled: !!serviceId && serviceId !== '',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Mutations
export const useSubmitReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ReviewInput) => reviewFetchers.submitReview(input),
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      if (variables.orderId) {
        queryClient.invalidateQueries({ queryKey: reviewKeys.byOrder(variables.orderId) });
      }
      if (variables.bookingId) {
        queryClient.invalidateQueries({ queryKey: reviewKeys.byBooking(variables.bookingId) });
      }
      toast.success('Thank you for your review!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit review');
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, input }: { reviewId: string; input: Partial<ReviewInput> }) =>
      reviewFetchers.updateReview(reviewId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      toast.success('Review updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update review');
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => reviewFetchers.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      toast.success('Review deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete review');
    },
  });
};
