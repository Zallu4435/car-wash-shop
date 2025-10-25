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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="container-custom px-4">
        <Card className="w-full max-w-md mx-auto border-2">
          <CardContent className="py-12 text-center">
            {/* Animated Loader */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full animate-ping"></div>
              </div>
              <Loader2 className="h-16 w-16 animate-spin mx-auto text-primary relative z-10" />
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Processing Payment
            </h2>
            <p className="text-muted-foreground mb-8">
              Please wait while we securely process your payment...
            </p>

            {/* Security Icons */}
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-muted rounded-full">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground">Secure</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-muted rounded-full">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground">Protected</span>
              </div>
            </div>

            {/* Warning */}
            <div className="p-4 bg-muted rounded-xl border border-border">
              <p className="text-sm text-muted-foreground font-medium">
                ⚠️ Do not refresh or close this page
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
