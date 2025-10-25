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
    <Card className="sticky top-24 border-2">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ShoppingCart className="h-5 w-5 text-primary" />
          </div>
          <CardTitle>Order Summary</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <PricingBreakdown
          subtotal={subtotal}
          discount={discount}
          deliveryFee={deliveryFee}
          total={total}
        />
        
        <Button
          onClick={onCheckout}
          disabled={isLoading}
          className="w-full shadow-lg"
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
        <div className="pt-4 border-t border-border space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-1 w-1 rounded-full bg-green-600" />
            <span>Secure checkout</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-1 w-1 rounded-full bg-green-600" />
            <span>Free delivery on orders above ₹500</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-1 w-1 rounded-full bg-green-600" />
            <span>Easy returns within 7 days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
