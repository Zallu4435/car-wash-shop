export interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  validFrom: string;
  validTo: string;
  usageLimit?: number;
  usedCount: number;
  applicableOn: 'all' | 'products' | 'services';
  isActive: boolean;
}

export interface ApplyCouponInput {
  code: string;
  amount: number;
}

export interface CouponValidation {
  valid: boolean;
  discount: number;
  finalAmount: number;
  message?: string;
}
