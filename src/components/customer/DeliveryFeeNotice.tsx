// DeliveryFeeNotice.tsx
import { AlertCircle, CheckCircle } from 'lucide-react';

interface DeliveryFeeNoticeProps {
  orderAmount: number;
  paymentMethod?: 'cod' | 'online';
  codFee?: number;
  freeDeliveryMin?: number;
}

export function DeliveryFeeNotice({
  orderAmount,
  codFee = 40,
  freeDeliveryMin = 500,
}: DeliveryFeeNoticeProps) {
  const isFreeDelivery = orderAmount >= freeDeliveryMin;
  const deliveryFee = orderAmount < freeDeliveryMin ? codFee : 0;

  if (isFreeDelivery) {
    return (
      <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-primary/5 border-2 border-primary/20 rounded-lg sm:rounded-xl">
        <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground text-sm sm:text-base mb-0.5 sm:mb-1">
            Free Delivery!
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Orders above ₹{freeDeliveryMin} qualify for free delivery
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-muted border-2 border-border rounded-lg sm:rounded-xl">
      <div className="p-1.5 sm:p-2 bg-muted-foreground/10 rounded-lg flex-shrink-0">
        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-foreground text-sm sm:text-base mb-0.5 sm:mb-1">
          Delivery Fee: ₹{deliveryFee}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Add ₹{freeDeliveryMin - orderAmount} more to get free delivery
        </p>
      </div>
    </div>
  );
}

