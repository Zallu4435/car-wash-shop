export type CouponType = 'percentage' | 'flat';
export type CouponApplicableOn = 'services' | 'products' | 'both';

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  applicableOn: CouponApplicableOn;
  active: boolean;
  createdAt: string;
}
