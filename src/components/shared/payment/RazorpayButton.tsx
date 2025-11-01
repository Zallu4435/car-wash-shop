'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRazorpay } from '@/hooks/useRazorpay';
import { Loader2, CreditCard } from 'lucide-react';
import type { PaymentDetails } from '@/lib/payment/razorpay-types';

interface RazorpayButtonProps {
  amount: number;
  description: string;
  orderId?: string;
  bookingId?: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
  notes?: Record<string, string>;
  onSuccess?: (paymentId: string, orderId: string) => void | Promise<void>;
  onFailure?: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function RazorpayButton({
  amount,
  description,
  orderId,
  bookingId,
  userId,
  userEmail,
  userName,
  userPhone,
  notes,
  onSuccess,
  onFailure,
  disabled,
  className,
  children,
}: RazorpayButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const { processPayment, isLoading, isScriptLoaded } = useRazorpay({
    onSuccess: async (response) => {
      setIsProcessing(true);
      try {
        if (onSuccess) {
          await onSuccess(response.razorpay_payment_id, response.razorpay_order_id);
        }
      } finally {
        setIsProcessing(false);
      }
    },
    onFailure: () => {
      if (onFailure) {
        onFailure();
      }
    },
  });

  const handlePayment = async () => {
    const paymentDetails: PaymentDetails = {
      amount,
      description,
      orderId,
      bookingId,
      userId,
      userEmail,
      userName,
      userPhone,
      notes,
    };

    await processPayment(paymentDetails);
  };

  const isButtonDisabled = disabled || isLoading || isProcessing || !isScriptLoaded;

  return (
    <Button
      onClick={handlePayment}
      disabled={isButtonDisabled}
      className={className}
      size="lg"
    >
      {isLoading || isProcessing ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-5 w-5" />
          {children || `Pay ₹${amount}`}
        </>
      )}
    </Button>
  );
}
