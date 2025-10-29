import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checkoutFetchers } from './fetchers';
import type {
  CheckoutSessionInput,
  PaymentSuccessInput,
  PaymentFailureInput,
} from '@/types/checkout';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { bookingKeys } from '../bookings/queries';
import { orderKeys } from '../orders/queries';

export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: (input: CheckoutSessionInput) =>
      checkoutFetchers.createCheckoutSession(input),
    onSuccess: (data) => {
      // Redirect to payment gateway
      if (typeof window !== 'undefined') {
        window.location.href = data.paymentUrl;
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to initiate payment');
    },
  });
};

export const useHandlePaymentSuccess = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (input: PaymentSuccessInput) =>
      checkoutFetchers.handlePaymentSuccess(input),
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: bookingKeys.detail(data.bookingId),
      });

      toast.success('Payment successful!');
      router.push(`/orders/${data.bookingId}?success=true`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Payment verification failed');
    },
  });
};

export const useHandlePaymentFailure = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (input: PaymentFailureInput) =>
      checkoutFetchers.handlePaymentFailure(input),
    onSuccess: (data) => {
      toast.error('Payment failed. Please try again.');
      router.push(`/bookings/${data.bookingId}?payment=failed`);
    },
  });
};
