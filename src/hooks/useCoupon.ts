import { useState } from 'react';
import { applyCoupon } from '@/lib/utils/pricing';

interface Coupon {
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  minOrderValue: number;
}

export function useCoupon(orderAmount: number) {
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discount, setDiscount] = useState(0);

  const apply = (coupon: Coupon) => {
    const result = applyCoupon(orderAmount, coupon);
    if (result.isValid) {
      setAppliedCoupon(coupon);
      setDiscount(result.discountAmount);
      return { success: true, discount: result.discountAmount };
    }
    return { success: false, discount: 0 };
  };

  const remove = () => {
    setAppliedCoupon(null);
    setDiscount(0);
  };

  return {
    appliedCoupon,
    discount,
    apply,
    remove,
  };
}
