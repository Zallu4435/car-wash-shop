'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/api/client';
import { RAZORPAY_CONFIG, RAZORPAY_SCRIPT_URL } from '@/lib/payment/razorpay-config';
import type {
  PaymentDetails,
  RazorpayOptions,
  RazorpaySuccessResponse,
  RazorpayErrorResponse,
} from '@/lib/payment/razorpay-types';

interface UseRazorpayOptions {
  onSuccess?: (response: RazorpaySuccessResponse) => void | Promise<void>;
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

  // Create Razorpay order via backend API
  const createOrder = useCallback(
    async (bookingData: any, amount: number, paymentType: string = 'advance'): Promise<string | null> => {
      try {
        const response = await apiClient.post('/checkout/session', {
          bookingData,
          amount,
          paymentType,
        });

        if (response.data?.success && response.data?.data?.orderId) {
          return response.data.data.orderId;
        }
        throw new Error('Failed to create order');
      } catch (error: any) {
        console.error('Error creating order:', error);
        toast.error(error?.message || 'Failed to initiate payment');
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
    ): Promise<{ success: boolean; bookingId?: string; message?: string }> => {
      try {
        const response = await apiClient.post('/checkout/verify', {
          razorpay_order_id: razorpayOrderId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
        });

        if (response.data?.success && response.data?.data) {
          return {
            success: true,
            bookingId: response.data.data.bookingId,
            message: response.data.data.message,
          };
        }
        return { success: false };
      } catch (error: any) {
        console.error('Error verifying payment:', error);
        toast.error(error?.message || 'Payment verification failed');
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

      if (!paymentDetails.bookingData) {
        toast.error('Booking data is required for payment');
        return;
      }

      setIsLoading(true);

      try {
        // Step 1: Create order via backend (requires bookingData)
        const orderId = await createOrder(
          paymentDetails.bookingData,
          paymentDetails.amount,
          paymentDetails.paymentType || 'advance'
        );

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
              const successResponse = {
                ...response,
                bookingId: verificationResult.bookingId,
                message: verificationResult.message,
              };
              if (options?.onSuccess) {
                await options.onSuccess(successResponse as any);
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
      } catch (error) {
        console.error('Payment error:', error);
        toast.error('Failed to process payment');
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
