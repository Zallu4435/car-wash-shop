import { z } from 'zod';

// ============================================
// Reusable Field Validations
// ============================================

// Rating validation
const ratingValidation = z
  .number()
  .min(1, 'Please select at least 1 star')
  .max(5, 'Rating cannot exceed 5 stars')
  .int('Rating must be a whole number')
  .refine((val) => val >= 1 && val <= 5, {
    message: 'Please select a rating between 1 and 5 stars',
  });

// Comment validation
const commentValidation = z
  .string()
  .trim()
  .min(10, 'Review must be at least 10 characters')
  .max(500, 'Review cannot exceed 500 characters');

// Optional comment validation (for quick ratings)
const optionalCommentValidation = z
  .string()
  .trim()
  .max(500, 'Review cannot exceed 500 characters')
  .optional()
  .or(z.literal(''));

// ============================================
// Submit Review Schema
// ============================================

export const submitReviewSchema = z.object({
  rating: ratingValidation,
  comment: commentValidation,
  orderId: z.string().optional(),
  bookingId: z.string().optional(),
  productId: z.string().optional(),
  serviceId: z.string().optional(),
}).refine(
  (data) => data.orderId || data.bookingId || data.productId || data.serviceId,
  {
    message: 'At least one ID (order, booking, product, or service) is required',
    path: ['orderId'],
  }
);

// ============================================
// Quick Review Schema (Rating only, optional comment)
// ============================================

export const quickReviewSchema = z.object({
  rating: ratingValidation,
  comment: optionalCommentValidation,
  orderId: z.string().optional(),
  bookingId: z.string().optional(),
  productId: z.string().optional(),
  serviceId: z.string().optional(),
});

// ============================================
// Update Review Schema
// ============================================

export const updateReviewSchema = z.object({
  reviewId: z.string().min(1, 'Review ID is required'),
  rating: ratingValidation,
  comment: commentValidation,
});

// ============================================
// Type Exports
// ============================================

export type SubmitReviewInput = z.infer<typeof submitReviewSchema>;
export type QuickReviewInput = z.infer<typeof quickReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
