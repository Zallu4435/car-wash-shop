// components/customer/CartSummary.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PricingBreakdown } from '@/components/shared/pricing/PricingBreakdown';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Lock } from 'lucide-react';

interface CartSummaryProps {
  subtotal: number;
  discount?: number;
  deliveryFee?: number;
  total: number;
  onCheckout: () => void;
  isLoading?: boolean;
}

export function CartSummary({
  subtotal,
  discount = 0,
  deliveryFee = 0,
  total,
  onCheckout,
  isLoading = false,
}: CartSummaryProps) {
  return (
    <Card className="lg:sticky lg:top-24 border-2">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <CardTitle className="text-base sm:text-lg">Order Summary</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <PricingBreakdown
          subtotal={subtotal}
          discount={discount}
          deliveryFee={deliveryFee}
          total={total}
        />
        
        <Button
          onClick={onCheckout}
          disabled={isLoading}
          className="w-full shadow-lg h-11 sm:h-12 text-sm sm:text-base border-2"
          size="lg"
        >
          {isLoading ? (
            'Processing...'
          ) : (
            <>
              <Lock className="mr-2 h-4 w-4" />
              Proceed to Checkout
            </>
          )}
        </Button>

        {/* Trust Badges */}
        <div className="pt-3 sm:pt-4 border-t border-border space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
            <div className="h-1 w-1 rounded-full bg-green-600 flex-shrink-0" />
            <span>Secure checkout</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
            <div className="h-1 w-1 rounded-full bg-green-600 flex-shrink-0" />
            <span>Free delivery on orders above ₹500</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
            <div className="h-1 w-1 rounded-full bg-green-600 flex-shrink-0" />
            <span>Easy returns within 7 days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
