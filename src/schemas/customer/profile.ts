import { z } from 'zod';

// ============================================
// Reusable Field Validations
// ============================================

// Name validation
const nameValidation = z
  .string()
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must not exceed 50 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens and apostrophes')
  .transform((val) => val.replace(/\s+/g, ' ')); // Normalize multiple spaces

// Email validation
const emailValidation = z
  .string()
  .trim()
  .email('Please enter a valid email address')
  .max(100, 'Email is too long')
  .toLowerCase(); // Normalize to lowercase

// Phone validation for Indian numbers
const phoneValidation = z
  .string()
  .trim()
  .min(10, 'Phone number is required')
  .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number starting with 6-9');

// Password validation
const passwordValidation = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(100, 'Password is too long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter (A-Z)')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter (a-z)')
  .regex(/[0-9]/, 'Password must contain at least one number (0-9)')
  .regex(/[@$!%*?&#]/, 'Password must contain at least one special character (@$!%*?&#)');

// Current password validation (less strict for verification)
const currentPasswordValidation = z
  .string()
  .min(1, 'Current password is required')
  .min(8, 'Password must be at least 8 characters');

// ============================================
// Profile Edit Schema
// ============================================

export const profileEditSchema = z.object({
  name: nameValidation,
  email: emailValidation.optional().or(z.literal('')),
  phone: phoneValidation,
});

// Note: For address management, use the dedicated address schemas from @/schemas/address
// For vehicle management, use the dedicated vehicle schemas from @/schemas/vehicle

// ============================================
// Change Password Schema
// ============================================

export const changePasswordSchema = z
  .object({
    currentPassword: currentPasswordValidation,
    newPassword: passwordValidation,
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match. Please make sure both passwords are identical",
    path: ['confirmPassword'],
  });

// ============================================
// Update Email Schema (with OTP verification)
// ============================================

export const updateEmailRequestSchema = z.object({
  newEmail: emailValidation,
  password: currentPasswordValidation,
});

export const updateEmailVerifySchema = z.object({
  newEmail: emailValidation,
  otp: z
    .string()
    .trim()
    .min(6, 'OTP is required')
    .regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
});

// ============================================
// Update Phone Schema (with OTP verification)
// ============================================

export const updatePhoneRequestSchema = z.object({
  newPhone: phoneValidation,
  password: currentPasswordValidation,
});

export const updatePhoneVerifySchema = z.object({
  newPhone: phoneValidation,
  otp: z
    .string()
    .trim()
    .min(6, 'OTP is required')
    .regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
});

// ============================================
// Delete Account Schema
// ============================================

export const deleteAccountSchema = z.object({
  password: currentPasswordValidation,
  confirmation: z
    .string()
    .trim()
    .refine((val) => val === 'DELETE', {
      message: 'Please type DELETE to confirm account deletion',
    }),
  reason: z
    .string()
    .trim()
    .min(10, 'Please provide a reason (at least 10 characters)')
    .max(500, 'Reason is too long')
    .optional()
    .or(z.literal('')),
});

// ============================================
// Notification Preferences Schema
// ============================================

export const notificationPreferencesSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  bookingReminders: z.boolean().default(true),
  promotionalEmails: z.boolean().default(false),
  orderUpdates: z.boolean().default(true),
  newsletter: z.boolean().default(false),
});

// ============================================
// Privacy Settings Schema
// ============================================

export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(['public', 'private']).default('private'),
  showEmail: z.boolean().default(false),
  showPhone: z.boolean().default(false),
  allowDataSharing: z.boolean().default(false),
});

// ============================================
// Type Exports
// ============================================

export type ProfileEditInput = z.infer<typeof profileEditSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateEmailRequestInput = z.infer<typeof updateEmailRequestSchema>;
export type UpdateEmailVerifyInput = z.infer<typeof updateEmailVerifySchema>;
export type UpdatePhoneRequestInput = z.infer<typeof updatePhoneRequestSchema>;
export type UpdatePhoneVerifyInput = z.infer<typeof updatePhoneVerifySchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
export type NotificationPreferencesInput = z.infer<typeof notificationPreferencesSchema>;
export type PrivacySettingsInput = z.infer<typeof privacySettingsSchema>;
