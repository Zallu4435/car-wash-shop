import { AlertCircle, CheckCircle } from 'lucide-react';

interface DeliveryFeeNoticeProps {
  orderAmount: number;
  paymentMethod: 'cod' | 'online';
  codFee?: number;
  freeDeliveryMin?: number;
}

export function DeliveryFeeNotice({
  orderAmount,
  paymentMethod,
  codFee = 40,
  freeDeliveryMin = 500,
}: DeliveryFeeNoticeProps) {
  const isFreeDelivery = orderAmount >= freeDeliveryMin || paymentMethod === 'online';
  const deliveryFee = paymentMethod === 'cod' && orderAmount < freeDeliveryMin ? codFee : 0;

  if (isFreeDelivery) {
    return (
      <div className="flex items-start gap-3 p-4 bg-primary/5 border-2 border-primary/20 rounded-xl">
        <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
          <CheckCircle className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground mb-1">
            Free Delivery!
          </p>
          <p className="text-sm text-muted-foreground">
            {paymentMethod === 'online'
              ? 'No delivery fee for online payment'
              : `Order above ₹${freeDeliveryMin} - Free delivery`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 p-4 bg-muted border-2 border-border rounded-xl">
      <div className="p-2 bg-muted-foreground/10 rounded-lg flex-shrink-0">
        <AlertCircle className="h-5 w-5 text-muted-foreground" />
      </div>
      <div>
        <p className="font-semibold text-foreground mb-1">
          Delivery Fee: ₹{deliveryFee}
        </p>
        <p className="text-sm text-muted-foreground">
          Add ₹{freeDeliveryMin - orderAmount} more to get free delivery or choose online payment.
        </p>
      </div>
    </div>
  );
}
