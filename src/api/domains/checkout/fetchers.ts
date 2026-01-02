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

export const checkoutFetchers = {
  async createCheckoutSession(
    input: CheckoutSessionInput
  ): Promise<CheckoutSession> {
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

  async getDeliverySettings(): Promise<{
    deliveryFee: number;
    freeDeliveryThreshold: number;
    isEnabled: boolean;
  }> {
    const { data } = await apiClient.get<ApiResponse<{
      deliveryFee: number;
      freeDeliveryThreshold: number;
      isEnabled: boolean;
    }>>('/delivery-settings');
    return data.data!;
  },
};
