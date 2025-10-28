'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Lock, Shield } from 'lucide-react';

export default function PaymentPage() {
  const router = useRouter();

  useEffect(() => {
    // Simulate payment processing
    const timer = setTimeout(() => {
      router.push('/payment/status?status=success&orderId=ORD' + Date.now());
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="container-custom">
        <Card className="w-full max-w-md mx-auto border-2">
          <CardContent className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 text-center">
            {/* Animated Loader */}
            <div className="relative mb-6 sm:mb-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full animate-ping"></div>
              </div>
              <Loader2 className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 animate-spin mx-auto text-primary relative z-10" />
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 sm:mb-3">
              Processing Payment
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 px-2">
              Please wait while we securely process your payment...
            </p>

            {/* Security Icons */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                <div className="p-2 sm:p-3 bg-muted rounded-full">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <span className="text-[10px] sm:text-xs text-muted-foreground">Secure</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                <div className="p-2 sm:p-3 bg-muted rounded-full">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <span className="text-[10px] sm:text-xs text-muted-foreground">Protected</span>
              </div>
            </div>

            {/* Warning */}
            <div className="p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border border-border">
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                ⚠️ Do not refresh or close this page
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
