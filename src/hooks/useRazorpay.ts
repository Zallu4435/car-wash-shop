'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/api/client';
import { RAZORPAY_CONFIG, RAZORPAY_SCRIPT_URL } from '@/lib/payment/razorpay-config';
import type {
  PaymentDetails,
  ProductOrderPaymentPayload,
  RazorpayOptions,
  RazorpaySuccessResponse,
  RazorpayErrorResponse,
} from '@/lib/payment/razorpay-types';

type CheckoutVerificationResult = {
  success: boolean;
  type?: 'service' | 'product';
  bookingId?: string;
  orderId?: string;
  orderNumber?: string;
  message?: string;
};

type RazorpaySuccessWithResult = RazorpaySuccessResponse & {
  checkoutResult?: CheckoutVerificationResult;
};

interface UseRazorpayOptions {
  onSuccess?: (response: RazorpaySuccessWithResult) => void | Promise<void>;
  onFailure?: (error: RazorpayErrorResponse) => void;
  onDismiss?: () => void;
}

export function useRazorpay(options?: UseRazorpayOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise<boolean>((resolve) => {
        // Check if script already loaded
        if (window.Razorpay) {
          setIsScriptLoaded(true);
          resolve(true);
          return;
        }

        // Check if script tag already exists
        const existingScript = document.querySelector(
          `script[src="${RAZORPAY_SCRIPT_URL}"]`
        );

        if (existingScript) {
          existingScript.addEventListener('load', () => {
            setIsScriptLoaded(true);
            resolve(true);
          });
          return;
        }

        // Create and load script
        const script = document.createElement('script');
        script.src = RAZORPAY_SCRIPT_URL;
        script.async = true;

        script.onload = () => {
          setIsScriptLoaded(true);
          resolve(true);
        };

        script.onerror = () => {
          console.error('Failed to load Razorpay script');
          toast.error('Failed to load payment gateway');
          resolve(false);
        };

        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  type CheckoutSessionPayload = {
    type: 'service' | 'product';
    amount: number;
    paymentType?: string;
    bookingData?: {
      serviceId: string;
      serviceName?: string;
      vehicleId: string;
      slotId: string;
      addressId: string;
      addOns?: string[];
      couponCode?: string;
      paymentType: 'full' | 'advance';
      coordinates?: {
        latitude: number;
        longitude: number;
      };
    };
    orderData?: ProductOrderPaymentPayload;
  };

  // Create Razorpay order via backend API
  const createOrder = useCallback(
    async (payload: CheckoutSessionPayload): Promise<string | null> => {
      try {
        const response = await apiClient.post('/checkout/session', {
          ...payload,
        });

        if (response.data?.success && response.data?.data?.orderId) {
          return response.data.data.orderId;
        }
        throw new Error('Failed to create order');
      } catch (error: unknown) {
        console.error('Error creating order:', error);
        const message = error instanceof Error ? error.message : 'Failed to initiate payment';
        toast.error(message);
        return null;
      }
    },
    []
  );

  // Verify payment via backend API
  const verifyPayment = useCallback(
    async (
      razorpayOrderId: string,
      razorpayPaymentId: string,
      razorpaySignature: string
    ): Promise<CheckoutVerificationResult> => {
      try {
        const response = await apiClient.post('/checkout/verify', {
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
        });

        if (response.data?.success && response.data?.data) {
          return {
            success: true,
            type: response.data.data.type,
            bookingId: response.data.data.bookingId,
            orderId: response.data.data.orderId,
            orderNumber: response.data.data.orderNumber,
            message: response.data.data.message,
          };
        }
        return { success: false };
      } catch (error: unknown) {
        console.error('Error verifying payment:', error);
        const message = error instanceof Error ? error.message : 'Payment verification failed';
        toast.error(message);
        return { success: false };
      }
    },
    []
  );

  // Process payment
  const processPayment = useCallback(
    async (paymentDetails: PaymentDetails) => {
      if (!isScriptLoaded) {
        toast.error('Payment gateway is loading. Please try again.');
        return;
      }

      if (!RAZORPAY_CONFIG.KEY_ID) {
        toast.error('Payment gateway not configured');
        console.error('Razorpay Key ID is missing');
        return;
      }

      setIsLoading(true);

      try {
        const checkoutType = paymentDetails.checkoutType || 'service';

        const sessionPayload: CheckoutSessionPayload = {
          type: checkoutType,
          amount: paymentDetails.amount,
        };

        if (checkoutType === 'service') {
          if (!paymentDetails.bookingData) {
            toast.error('Booking data is required for payment');
            setIsLoading(false);
            return;
          }
          sessionPayload.bookingData = paymentDetails.bookingData;
          sessionPayload.paymentType = paymentDetails.paymentType || 'advance';
        } else {
          if (!paymentDetails.productOrder) {
            toast.error('Order data is required for product payment');
            setIsLoading(false);
            return;
          }
          sessionPayload.orderData = paymentDetails.productOrder;
          sessionPayload.paymentType = 'full';
        }

        // Step 1: Create order via backend
        const orderId = await createOrder(sessionPayload);

        if (!orderId) {
          throw new Error('Failed to create payment order');
        }

        // Step 2: Open Razorpay checkout
        const razorpayOptions: RazorpayOptions = {
          key: RAZORPAY_CONFIG.KEY_ID,
          amount: Math.round(paymentDetails.amount * 100), // Convert to paise
          currency: RAZORPAY_CONFIG.CURRENCY,
          name: RAZORPAY_CONFIG.COMPANY_NAME,
          description: paymentDetails.description,
          image: RAZORPAY_CONFIG.COMPANY_LOGO,
          order_id: orderId,
          prefill: {
            name: paymentDetails.userName,
            email: paymentDetails.userEmail,
            contact: paymentDetails.userPhone,
          },
          notes: paymentDetails.notes || {},
          theme: {
            color: RAZORPAY_CONFIG.THEME_COLOR,
          },
          handler: async (response: RazorpaySuccessResponse) => {
            // Step 3: Verify payment
            const verificationResult = await verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            if (verificationResult.success) {
              // Add bookingId to response if available
              const successResponse: RazorpaySuccessWithResult = {
                ...response,
                checkoutResult: verificationResult,
              };
              if (options?.onSuccess) {
                await options.onSuccess(successResponse);
              }
            } else {
              toast.error('Payment verification failed');
              if (options?.onFailure) {
                options.onFailure({
                  error: {
                    code: 'VERIFICATION_FAILED',
                    description: 'Payment verification failed',
                    source: 'server',
                    step: 'verification',
                    reason: 'signature_mismatch',
                    metadata: {
                      order_id: response.razorpay_order_id,
                      payment_id: response.razorpay_payment_id,
                    },
                  },
                });
              }
            }
            setIsLoading(false);
          },
          modal: {
            ondismiss: () => {
              toast.info('Payment cancelled');
              if (options?.onDismiss) {
                options.onDismiss();
              }
              setIsLoading(false);
            },
          },
        };

        const razorpay = new window.Razorpay(razorpayOptions);

        // Handle payment failure
        razorpay.on('payment.failed', (response: RazorpayErrorResponse) => {
          toast.error('Payment failed. Please try again.');
          if (options?.onFailure) {
            options.onFailure(response);
          }
          setIsLoading(false);
        });

        razorpay.open();
      } catch (error: unknown) {
        console.error('Payment error:', error);
        const message = error instanceof Error ? error.message : 'Failed to process payment';
        toast.error(message);
        setIsLoading(false);
      }
    },
    [isScriptLoaded, createOrder, verifyPayment, options]
  );

  return {
    processPayment,
    isLoading,
    isScriptLoaded,
  };
}
