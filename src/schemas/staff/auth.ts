import { z } from 'zod';

// ============================================
// Reusable Field Validations
// ============================================

// Phone validation for Indian numbers
const phoneValidation = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number starting with 6-9');

// OTP validation
const otpValidation = z
  .string()
  .trim()
  .regex(/^\d{6}$/, 'OTP must be exactly 6 digits');

// ============================================
// Staff Login Schema
// ============================================

export const staffLoginSchema = z.object({
  phone: phoneValidation,
  otp: otpValidation,
});

// ============================================
// Request OTP Schema
// ============================================

export const requestOtpSchema = z.object({
  phone: phoneValidation,
});

// ============================================
// Type Exports
// ============================================

export type StaffLoginInput = z.infer<typeof staffLoginSchema>;
export type RequestOtpInput = z.infer<typeof requestOtpSchema>;
