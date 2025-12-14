import { z } from 'zod';

// ============================================
// Reusable Field Validations
// ============================================

// Address ID validation
const addressIdValidation = z
  .string()
  .min(1, 'Please select a delivery address');

// Payment method validation
const paymentMethodValidation = z
  .string()
  .min(1, 'Please select a payment method')
  .refine(
    (val) => ['cod', 'online'].includes(val),
    { message: 'Please select a valid payment method' }
  ) as any;

// Order amount validation
const amountValidation = z
  .number()
  .positive('Order amount must be greater than 0')
  .min(100, 'Minimum order amount is ₹100');

// ============================================
// Checkout Schema
// ============================================

export const checkoutSchema = z.object({
  addressId: addressIdValidation,
  paymentMethod: paymentMethodValidation,
  subtotal: amountValidation,
  discount: z.number().min(0).default(0),
  deliveryFee: z.number().min(0).default(0),
  total: z.number().positive('Total amount must be greater than 0'),
}).refine(
  (data) => data.subtotal >= 100,
  {
    message: 'Minimum order amount is ₹100',
    path: ['subtotal'],
  }
).refine(
  (data) => data.total === (data.subtotal - data.discount + data.deliveryFee),
  {
    message: 'Total amount calculation is incorrect',
    path: ['total'],
  }
);

// ============================================
// Create Checkout Session Schema
// ============================================

export const createCheckoutSessionSchema = z.object({
  bookingId: z.string().optional(),
  orderId: z.string().optional(),
  paymentType: z
    .string()
    .refine(
      (val) => ['full', 'advance'].includes(val),
      { message: 'Invalid payment type' }
    ) as any,
  amount: z.number().positive('Amount must be greater than 0'),
  addressId: addressIdValidation,
});

// ============================================
// Type Exports
// ============================================

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CreateCheckoutSessionInput = z.infer<typeof createCheckoutSessionSchema>;
