export const calculateDiscount = (
  amount: number,
  discountType: 'percentage' | 'flat',
  discountValue: number
): number => {
  if (discountType === 'percentage') {
    return Math.round((amount * discountValue) / 100);
  }
  return discountValue;
};

export const calculateAdvancePayment = (
  totalAmount: number,
  advancePercentage: number = 30
): number => {
  return Math.round((totalAmount * advancePercentage) / 100);
};

export const calculateBalanceAmount = (
  totalAmount: number,
  advancePaid: number
): number => {
  return totalAmount - advancePaid;
};

export const calculateDeliveryFee = (
  orderAmount: number,
  paymentMethod: 'cod' | 'online',
  codFee: number = 40,
  freeDeliveryMin: number = 500
): number => {
  if (orderAmount >= freeDeliveryMin) return 0;
  if (paymentMethod === 'cod') return codFee;
  return 0;
};

export const calculateTotal = (
  subtotal: number,
  discount: number = 0,
  deliveryFee: number = 0
): number => {
  return subtotal - discount + deliveryFee;
};

export const applyCoupon = (
  amount: number,
  coupon: { type: 'percentage' | 'flat'; value: number; minOrderValue: number }
): { discountAmount: number; finalAmount: number; isValid: boolean } => {
  if (amount < coupon.minOrderValue) {
    return { discountAmount: 0, finalAmount: amount, isValid: false };
  }

  const discountAmount = calculateDiscount(amount, coupon.type, coupon.value);
  return {
    discountAmount,
    finalAmount: amount - discountAmount,
    isValid: true,
  };
};
