'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CustomerRoutes } from '@/lib/constants/routes';
import { Loader2, Lock, Shield } from 'lucide-react';

export default function PaymentPage() {
  const router = useRouter();

  useEffect(() => {
    // Simulate payment processing
    const timer = setTimeout(() => {
      router.push(`${CustomerRoutes.PAYMENT_RECEIPT}?orderId=ORD${Date.now()}&service=true`);
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="container-custom">
        <div className="w-full max-w-md mx-auto border-2 rounded-xl bg-white/90 shadow-md p-10 text-center">
          <div className="relative mb-7">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full animate-ping"></div>
            </div>
            <Loader2 className="h-14 w-14 animate-spin mx-auto text-primary relative z-10" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Processing Payment</h2>
          <p className="text-base text-muted-foreground mb-8">Please wait while we securely process your payment...</p>
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="flex flex-col items-center">
              <div className="p-2 bg-muted rounded-full"><Lock className="h-5 w-5 text-primary" /></div>
              <span className="text-xs text-muted-foreground mt-1">Secure</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-2 bg-muted rounded-full"><Shield className="h-5 w-5 text-primary" /></div>
              <span className="text-xs text-muted-foreground mt-1">Protected</span>
            </div>
          </div>
          <div className="p-3 bg-muted rounded-lg border border-border">
            <p className="text-xs text-muted-foreground font-medium">⚠️ Do not refresh or close this page</p>
          </div>
        </div>
      </div>
    </div>
  );
}
