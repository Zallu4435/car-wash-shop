import { useState } from 'react';

export function usePayment() {
  const [isProcessing, setIsProcessing] = useState(false);

  const processPayment = async (
    amount: number,
    method: 'card' | 'upi' | 'wallet'
  ): Promise<{ success: boolean; transactionId?: string }> => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);

    // Mock success
    return {
      success: true,
      transactionId: 'TXN' + Date.now(),
    };
  };

  return {
    isProcessing,
    processPayment,
  };
}
