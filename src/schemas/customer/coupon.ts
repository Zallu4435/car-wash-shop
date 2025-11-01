import { z } from 'zod';

// ============================================
// Coupon Code Validation
// ============================================

const couponCodeValidation = z
  .string()
  .trim()
  .min(3, 'Coupon code must be at least 3 characters')
  .max(20, 'Coupon code is too long')
  .regex(/^[A-Z0-9-]+$/, 'Coupon code can only contain uppercase letters, numbers, and dashes')
  .transform((val) => val.toUpperCase());

// ============================================
// Apply Coupon Schema
// ============================================

export const applyCouponSchema = z.object({
  code: couponCodeValidation,
  amount: z
    .number()
    .positive('Order amount must be greater than 0')
    .min(1, 'Order amount is required'),
});

// ============================================
// Validate Coupon Schema (for API)
// ============================================

export const validateCouponSchema = z.object({
  code: couponCodeValidation,
  amount: z.number().positive(),
  userId: z.string().optional(),
});

// ============================================
// Type Exports
// ============================================

export type ApplyCouponInput = z.infer<typeof applyCouponSchema>;
export type ValidateCouponInput = z.infer<typeof validateCouponSchema>;
