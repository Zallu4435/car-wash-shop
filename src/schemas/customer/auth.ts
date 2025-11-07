import { z } from 'zod';

// Phone validation for Indian numbers
const phoneValidation = z
  .string()
  .trim()
  .min(10, 'Phone number is required')
  .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number starting with 6-9');

// OTP validation
const otpValidation = z
  .string()
  .trim()
  .min(6, 'OTP is required')
  .regex(/^\d{6}$/, 'OTP must be exactly 6 digits');

// Password validation with detailed error messages
const passwordValidation = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(100, 'Password is too long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter (A-Z)')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter (a-z)')
  .regex(/[0-9]/, 'Password must contain at least one number (0-9)')
  .regex(/[@$!%*?&#]/, 'Password must contain at least one special character (@$!%*?&#)');

export const loginSchema = z.object({
  phone: phoneValidation,
  otp: otpValidation,
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must not exceed 50 characters')
      .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens and apostrophes')
      .transform((val) => val.replace(/\s+/g, ' ')), // Normalize multiple spaces
    email: z
      .string()
      .trim()
      .email('Please enter a valid email address')
      .max(100, 'Email is too long')
      .optional()
      .or(z.literal('')),
    phone: phoneValidation,
    password: passwordValidation,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match. Please make sure both passwords are identical",
    path: ['confirmPassword'],
  });

// Additional schemas for specific use cases
export const phoneOnlySchema = z.object({
  phone: phoneValidation,
});

export const otpOnlySchema = z.object({
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

// Email validation
const emailValidation = z
  .string()
  .trim()
  .email('Please enter a valid email address')
  .max(100, 'Email is too long');

// Identifier validation (email or phone) for forgot password
export const forgotPasswordIdentifierSchema = z
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

// Object schema used for form validation that expects an object with identifier
export const forgotPasswordIdentifierObjectSchema = z.object({
  identifier: forgotPasswordIdentifierSchema,
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PhoneOnlyInput = z.infer<typeof phoneOnlySchema>;
export type OtpOnlyInput = z.infer<typeof otpOnlySchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ForgotPasswordIdentifierInput = z.infer<typeof forgotPasswordIdentifierObjectSchema>;
