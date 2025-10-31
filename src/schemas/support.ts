import { z } from 'zod';

// ============================================
// Reusable Field Validations
// ============================================

// Subject validation
const subjectValidation = z
  .string()
  .trim()
  .min(5, 'Subject must be at least 5 characters')
  .max(100, 'Subject must not exceed 100 characters');

// Description validation
const descriptionValidation = z
  .string()
  .trim()
  .min(20, 'Please provide a detailed description (at least 20 characters)')
  .max(2000, 'Description is too long (maximum 2000 characters)');

// Order ID validation
const orderIdValidation = z
  .string()
  .trim()
  .min(1, 'Order ID is required when complaint is about an order')
  .regex(/^[A-Z0-9-]+$/i, 'Invalid order ID format');

// Service ID validation
const serviceIdValidation = z
  .string()
  .trim()
  .min(1, 'Service ID is required when complaint is about a service')
  .regex(/^[A-Z0-9-]+$/i, 'Invalid service ID format');

// Booking ID validation
const bookingIdValidation = z
  .string()
  .trim()
  .min(1, 'Booking ID is required when complaint is about a booking')
  .regex(/^[A-Z0-9-]+$/i, 'Invalid booking ID format');

// ============================================
// Complaint/Ticket Schema
// ============================================

export const complaintSchema = z
  .object({
    complaintCategory: z
      .string()
      .min(1, 'Please select what your complaint is about')
      .refine(
        (val) => ['order', 'service', 'booking', 'payment', 'staff', 'product', 'other'].includes(val),
        { message: 'Please select a valid complaint category' }
      ) as any,
    orderId: z.string().trim().optional(),
    serviceId: z.string().trim().optional(),
    bookingId: z.string().trim().optional(),
    issueType: z
      .string()
      .min(1, 'Please select the type of issue')
      .refine(
        (val) =>
          [
            'quality',
            'delay',
            'cancellation',
            'refund',
            'behavior',
            'pricing',
            'damage',
            'missing_items',
            'wrong_service',
            'payment_issue',
            'other',
          ].includes(val),
        { message: 'Please select a valid issue type' }
      ) as any,
    subject: subjectValidation,
    description: descriptionValidation,
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
    attachments: z
      .array(
        z.object({
          file: z.instanceof(File),
          name: z.string(),
          size: z.number(),
        })
      )
      .max(5, 'You can upload maximum 5 attachments')
      .optional(),
  })
  .refine(
    (data) => {
      // If complaint is about order, orderId is required
      if (data.complaintCategory === 'order') {
        return !!data.orderId && data.orderId.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Order ID is required when complaint is about an order',
      path: ['orderId'],
    }
  )
  .refine(
    (data) => {
      // If complaint is about service, serviceId is required
      if (data.complaintCategory === 'service') {
        return !!data.serviceId && data.serviceId.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Service ID is required when complaint is about a service',
      path: ['serviceId'],
    }
  )
  .refine(
    (data) => {
      // If complaint is about booking, bookingId is required
      if (data.complaintCategory === 'booking') {
        return !!data.bookingId && data.bookingId.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Booking ID is required when complaint is about a booking',
      path: ['bookingId'],
    }
  )
  .refine(
    (data) => {
      // Validate attachment file sizes (max 5MB each)
      if (data.attachments && data.attachments.length > 0) {
        return data.attachments.every((att) => att.size <= 5 * 1024 * 1024);
      }
      return true;
    },
    {
      message: 'Each attachment must be less than 5MB',
      path: ['attachments'],
    }
  );

// ============================================
// Feedback Schema
// ============================================

export const feedbackSchema = z.object({
  category: z.enum(['suggestion', 'feature_request', 'bug_report', 'general']),
  subject: subjectValidation,
  description: descriptionValidation,
  rating: z
    .number()
    .min(1, 'Please provide a rating')
    .max(5, 'Rating must be between 1 and 5')
    .optional(),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .max(100, 'Email is too long')
    .optional()
    .or(z.literal('')),
});

// ============================================
// Contact Us Schema
// ============================================

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens and apostrophes'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .max(100, 'Email is too long')
    .toLowerCase(),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number')
    .optional()
    .or(z.literal('')),
  subject: subjectValidation,
  message: descriptionValidation,
  preferredContactMethod: z.enum(['email', 'phone', 'any']).default('email'),
});

// ============================================
// Ticket Reply Schema
// ============================================

export const ticketReplySchema = z.object({
  ticketId: z.string().min(1, 'Ticket ID is required'),
  message: z
    .string()
    .trim()
    .min(10, 'Reply must be at least 10 characters')
    .max(1000, 'Reply is too long (maximum 1000 characters)'),
  attachments: z
    .array(
      z.object({
        file: z.instanceof(File),
        name: z.string(),
        size: z.number(),
      })
    )
    .max(3, 'You can upload maximum 3 attachments')
    .optional(),
});

// ============================================
// Service Rating Schema
// ============================================

export const serviceRatingSchema = z.object({
  serviceId: z.string().min(1, 'Service ID is required'),
  bookingId: z.string().min(1, 'Booking ID is required'),
  rating: z.number().min(1, 'Please provide a rating').max(5, 'Rating must be between 1 and 5'),
  review: z
    .string()
    .trim()
    .min(10, 'Review must be at least 10 characters')
    .max(500, 'Review is too long (maximum 500 characters)')
    .optional()
    .or(z.literal('')),
  staffRating: z.number().min(1).max(5).optional(),
  qualityRating: z.number().min(1).max(5).optional(),
  timelinessRating: z.number().min(1).max(5).optional(),
  wouldRecommend: z.boolean().default(true),
});

// ============================================
// Report Issue Schema (Quick Report)
// ============================================

export const quickReportSchema = z.object({
  issueType: z.enum(['bug', 'error', 'slow_performance', 'feature_not_working', 'other']),
  description: z
    .string()
    .trim()
    .min(10, 'Please describe the issue (at least 10 characters)')
    .max(500, 'Description is too long'),
  pageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  browserInfo: z.string().optional(),
  screenshot: z.instanceof(File).optional(),
});

// ============================================
// Type Exports
// ============================================

export type ComplaintInput = z.infer<typeof complaintSchema>;
export type FeedbackInput = z.infer<typeof feedbackSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type TicketReplyInput = z.infer<typeof ticketReplySchema>;
export type ServiceRatingInput = z.infer<typeof serviceRatingSchema>;
export type QuickReportInput = z.infer<typeof quickReportSchema>;
