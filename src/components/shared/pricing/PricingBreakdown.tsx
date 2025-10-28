// PricingBreakdown.tsx
import { Separator } from '@/components/ui/separator';

interface PricingBreakdownProps {
  subtotal: number;
  discount?: number;
  deliveryFee?: number;
  total: number;
}

export function PricingBreakdown({ subtotal, discount = 0, deliveryFee = 0, total }: PricingBreakdownProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Subtotal */}
      <div className="flex justify-between text-xs sm:text-sm gap-2">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="font-medium text-foreground">₹{subtotal}</span>
      </div>
      
      {/* Discount */}
      {discount > 0 && (
        <div className="flex justify-between text-xs sm:text-sm gap-2">
          <span className="text-green-600 dark:text-green-400">Discount</span>
          <span className="font-medium text-green-600 dark:text-green-400">-₹{discount}</span>
        </div>
      )}
      
      {/* Delivery Fee */}
      {deliveryFee !== undefined && (
        <div className="flex justify-between text-xs sm:text-sm gap-2">
          <span className="text-muted-foreground">Delivery Fee</span>
          <span className={deliveryFee === 0 ? 'text-green-600 dark:text-green-400 font-semibold' : 'font-medium text-foreground'}>
            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
          </span>
        </div>
      )}
      
      <Separator className="my-2 sm:my-3" />
      
      {/* Total */}
      <div className="flex justify-between items-center pt-1 sm:pt-2 gap-2">
        <span className="font-bold text-base sm:text-lg text-foreground">Total</span>
        <span className="font-bold text-xl sm:text-2xl text-primary">₹{total}</span>
      </div>
    </div>
  );
}
