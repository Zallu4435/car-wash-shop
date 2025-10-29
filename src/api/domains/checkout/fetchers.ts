import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/types/api';
import type {
  CheckoutSession,
  CheckoutSessionInput,
  PaymentSuccessInput,
  PaymentFailureInput,
  PaymentResponse,
} from '@/types/checkout';
import { CustomerRoutes } from '@/lib/constants/routes';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export const checkoutFetchers = {
  async createCheckoutSession(
    input: CheckoutSessionInput
  ): Promise<CheckoutSession> {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock checkout session (no payment URL for mock/COD mode)
      return {
        sessionId: `session_${Date.now()}`,
        bookingId: input.bookingId,
        amount: input.amount,
        paymentUrl: '', // Empty for COD/mock mode - will trigger redirect to success page
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      };
    }
    
    const { data } = await apiClient.post<ApiResponse<CheckoutSession>>(
      CustomerRoutes.CHECKOUT_SESSION,
      input
    );
    return data.data!;
  },

  async handlePaymentSuccess(
    input: PaymentSuccessInput
  ): Promise<PaymentResponse> {
    const { data } = await apiClient.post<ApiResponse<PaymentResponse>>(
      CustomerRoutes.CHECKOUT_SUCCESS,
      input
    );
    return data.data!;
  },

  async handlePaymentFailure(
    input: PaymentFailureInput
  ): Promise<PaymentResponse> {
    const { data } = await apiClient.post<ApiResponse<PaymentResponse>>(
      CustomerRoutes.CHECKOUT_FAILURE,
      input
    );
    return data.data!;
  },
};
