export const validateCoupon = (
  coupon: {
    code: string;
    minOrderValue: number;
    usageLimit: number;
    usedCount: number;
    validUntil: string;
    active: boolean;
  },
  orderAmount: number
): { isValid: boolean; message: string } => {
  if (!coupon.active) {
    return { isValid: false, message: 'Coupon is inactive' };
  }

  if (new Date(coupon.validUntil) < new Date()) {
    return { isValid: false, message: 'Coupon has expired' };
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    return { isValid: false, message: 'Coupon usage limit reached' };
  }

  if (orderAmount < coupon.minOrderValue) {
    return { 
      isValid: false, 
      message: `Minimum order value ₹${coupon.minOrderValue} required` 
    };
  }

  return { isValid: true, message: 'Coupon applied successfully' };
};
