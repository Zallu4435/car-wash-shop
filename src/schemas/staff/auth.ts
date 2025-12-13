import { z } from 'zod';

// ============================================
// Reusable Field Validations
// ============================================

// Phone validation for Indian numbers
const phoneValidation = z
  .string()
  .trim()
  .min(10, 'Phone number is required')
  .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number starting with 6-9');

// Email validation
const emailValidation = z
  .string()
  .trim()
  .email('Please enter a valid email address')
  .max(100, 'Email is too long');

// Identifier validation (email or phone)
const identifierValidation = z
  .string()
  .trim()
  .min(1, 'Email or phone number is required')
  .refine(
    (val) => {
      // Check if it's an email
      if (val.includes('@')) {
        return emailValidation.safeParse(val).success;
      }
      // Otherwise check if it's a valid phone
      return phoneValidation.safeParse(val).success;
    },
    {
      message: 'Please enter a valid email address or phone number',
    }
  );

// OTP validation
const otpValidation = z
  .string()
  .trim()
  .regex(/^\d{6}$/, 'OTP must be exactly 6 digits');

// ============================================
// Staff Login Schema
// ============================================

export const staffLoginSchema = z.object({
  identifier: identifierValidation,
  password: z
    .string()
    .min(1, 'Password is required'),
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
