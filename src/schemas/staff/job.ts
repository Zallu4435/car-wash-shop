import { z } from 'zod';

// ============================================
// Reusable Field Validations
// ============================================

// Notes validation
const notesValidation = z
  .string()
  .trim()
  .min(10, 'Please provide at least 10 characters')
  .max(500, 'Notes cannot exceed 500 characters')
  .optional()
  .or(z.literal(''));

// Rating validation (optional for staff)
const ratingValidation = z
  .number()
  .min(1, 'Rating must be at least 1')
  .max(5, 'Rating cannot exceed 5')
  .optional();

// ============================================
// Complete Job Schema
// ============================================

export const completeJobSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  notes: notesValidation,
  rating: ratingValidation,
});

// ============================================
// Start Job Schema
// ============================================

export const startJobSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  notes: z
    .string()
    .trim()
    .max(500, 'Notes cannot exceed 500 characters')
    .optional()
    .or(z.literal('')),
});

// ============================================
// Type Exports
// ============================================

export type CompleteJobInput = z.infer<typeof completeJobSchema>;
export type StartJobInput = z.infer<typeof startJobSchema>;
