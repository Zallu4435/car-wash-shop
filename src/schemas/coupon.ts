import { z } from 'zod';

export const couponSchema = z
  .object({
    code: z
      .string()
      .min(4, 'Code too short')
      .max(20, 'Code too long')
      .regex(/^[A-Z0-9]+$/, 'Code must be uppercase letters and numbers'),
    type: z.enum(['percentage', 'flat']),
    value: z.number().positive('Value must be positive'),
    minOrderValue: z.number().positive().optional(),
    maxDiscount: z.number().positive().optional(),
    validFrom: z.string().datetime(),
    validUntil: z.string().datetime(),
    usageLimit: z.number().int().positive(),
    applicableOn: z.enum(['services', 'products', 'both']),
    active: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.type === 'percentage' && data.value > 100) {
        return false;
      }
      return true;
    },
    {
      message: 'Percentage cannot exceed 100',
      path: ['value'],
    }
  )
  .refine((data) => new Date(data.validUntil) > new Date(data.validFrom), {
    message: 'End date must be after start date',
    path: ['validUntil'],
  });

export type CouponInput = z.infer<typeof couponSchema>;
