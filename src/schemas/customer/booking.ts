import { z } from 'zod';

// ============================================
// Reusable Field Validations
// ============================================

// Service ID validation
const serviceIdValidation = z
  .string()
  .min(1, 'Please select a service');

// Vehicle ID validation
const vehicleIdValidation = z
  .string()
  .min(1, 'Please select a vehicle');

// Address ID validation
const addressIdValidation = z
  .string()
  .min(1, 'Please select a service address');

// Date validation
const dateValidation = z
  .date()
  .refine(
    (date) => date !== null && date !== undefined,
    { message: 'Please select a date' }
  )
  .refine(
    (date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    },
    { message: 'Date cannot be in the past' }
  )
  .refine(
    (date) => {
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 90); // 90 days in advance
      return date <= maxDate;
    },
    { message: 'Cannot book more than 90 days in advance' }
  );

// Time validation (HH:MM format)
const timeValidation = z
  .string()
  .min(1, 'Please select a time')
  .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)')
  .refine(
    (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes;
      const minTime = 8 * 60; // 8:00 AM
      const maxTime = 20 * 60; // 8:00 PM
      return totalMinutes >= minTime && totalMinutes <= maxTime;
    },
    { message: 'Service hours are 8:00 AM to 8:00 PM' }
  );

// Payment type validation
const paymentTypeValidation = z
  .string()
  .min(1, 'Please select a payment option')
  .refine(
    (val) => ['full', 'advance'].includes(val),
    { message: 'Please select a valid payment option' }
  ) as any;

// Add-ons validation
const addOnsValidation = z
  .array(z.string())
  .optional()
  .default([]);

// Notes validation
const notesValidation = z
  .string()
  .trim()
  .max(500, 'Notes cannot exceed 500 characters')
  .optional()
  .or(z.literal(''));

// ============================================
// Create Booking Schema
// ============================================

export const createBookingSchema = z.object({
  serviceId: serviceIdValidation,
  vehicleId: vehicleIdValidation,
  addressId: addressIdValidation,
  scheduledDate: dateValidation,
  scheduledTime: timeValidation,
  addOns: addOnsValidation,
  paymentType: paymentTypeValidation,
  notes: notesValidation,
});

// ============================================
// Quick Booking Schema (Minimal fields)
// ============================================

export const quickBookingSchema = z.object({
  serviceId: serviceIdValidation,
  vehicleId: vehicleIdValidation,
  addressId: addressIdValidation,
  scheduledDate: dateValidation,
  scheduledTime: timeValidation,
});

// ============================================
// Reschedule Booking Schema
// ============================================

export const rescheduleBookingSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  scheduledDate: dateValidation,
  scheduledTime: timeValidation,
  reason: z
    .string()
    .trim()
    .min(10, 'Please provide a reason (at least 10 characters)')
    .max(200, 'Reason is too long'),
});

// ============================================
// Cancel Booking Schema
// ============================================

export const cancelBookingSchema = z.object({
  bookingId: z.string().min(1, 'Booking ID is required'),
  reason: z
    .string()
    .trim()
    .min(10, 'Please provide a reason (at least 10 characters)')
    .max(200, 'Reason is too long'),
  refundMethod: z
    .string()
    .min(1, 'Please select a refund method')
    .refine(
      (val) => ['original', 'wallet', 'bank'].includes(val),
      { message: 'Please select a valid refund method' }
    )
    .optional() as any,
});

// ============================================
// Type Exports
// ============================================

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type QuickBookingInput = z.infer<typeof quickBookingSchema>;
export type RescheduleBookingInput = z.infer<typeof rescheduleBookingSchema>;
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
