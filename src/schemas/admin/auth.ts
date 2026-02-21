import { z } from 'zod';

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

// Password validation
const passwordValidation = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters long');

// OTP validation
const otpValidation = z
  .string()
  .trim()
  .min(6, 'OTP is required')
  .regex(/^\d{6}$/, 'OTP must be exactly 6 digits');

// Admin login schema (identifier + password)
export const adminLoginSchema = z.object({
  identifier: identifierValidation,
  password: passwordValidation,
});

// Forgot password schemas (email only - OTP is sent via email)
export const forgotPasswordIdentifierSchema = z.object({
  identifier: emailValidation,
});

export const forgotPasswordOtpSchema = z.object({
  otp: otpValidation,
});

export const resetPasswordSchema = z
  .object({
    password: passwordValidation,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match. Please make sure both passwords are identical",
    path: ['confirmPassword'],
  });

// Type exports
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type ForgotPasswordIdentifierInput = z.infer<typeof forgotPasswordIdentifierSchema>;
export type ForgotPasswordOtpInput = z.infer<typeof forgotPasswordOtpSchema>;
export type AdminResetPasswordInput = z.infer<typeof resetPasswordSchema>;

