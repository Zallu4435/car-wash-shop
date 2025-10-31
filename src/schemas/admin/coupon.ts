import { z } from 'zod';

export const adminCouponSchema = z.object({
  code: z
    .string()
    .min(3, 'Coupon code must be at least 3 characters')
    .max(20, 'Coupon code must not exceed 20 characters')
    .regex(/^[A-Z0-9-]+$/, 'Coupon code can only contain uppercase letters, numbers, and dashes')
    .trim()
    .transform((val) => val.toUpperCase()),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(200, 'Description must not exceed 200 characters')
    .trim(),
  discountType: z
    .enum(['percentage', 'fixed'], {
      message: 'Please select a discount type',
    }),
  discountValue: z
    .number()
    .min(1, 'Discount value must be at least 1')
    .max(100000, 'Discount value is too high')
    .positive('Discount value must be positive'),
  minOrderAmount: z
    .number()
    .min(0, 'Minimum order amount cannot be negative')
    .optional(),
  maxDiscount: z
    .number()
    .min(0, 'Maximum discount cannot be negative')
    .optional(),
  usageLimit: z
    .number()
    .int('Usage limit must be a whole number')
    .min(1, 'Usage limit must be at least 1')
    .max(100000, 'Usage limit is too high')
    .optional(),
  validFrom: z
    .string()
    .min(1, 'Start date is required'),
  validUntil: z
    .string()
    .min(1, 'End date is required'),
  active: z.boolean().optional().default(true),
});

export type AdminCouponFormInput = z.infer<typeof adminCouponSchema>;
