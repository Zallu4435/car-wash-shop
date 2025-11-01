import { z } from 'zod';

// ============================================
// Reusable Field Validations
// ============================================

// Name validation
const nameValidation = z
  .string()
  .trim()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name cannot exceed 50 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

// Phone validation for Indian numbers
const phoneValidation = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number starting with 6-9');

// Email validation
const emailValidation = z
  .string()
  .trim()
  .email('Please enter a valid email address')
  .min(5, 'Email is too short')
  .max(100, 'Email is too long');

// Service area validation
const areaValidation = z
  .string()
  .trim()
  .min(3, 'Service area must be at least 3 characters')
  .max(100, 'Service area cannot exceed 100 characters');

// Avatar validation (optional)
const avatarValidation = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: 'Avatar must be less than 5MB',
  })
  .refine(
    (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
    {
      message: 'Avatar must be a JPEG, PNG, or WebP image',
    }
  )
  .optional();

// ============================================
// Staff Profile Edit Schema
// ============================================

export const staffProfileEditSchema = z.object({
  name: nameValidation,
  phone: phoneValidation,
  email: emailValidation,
  area: areaValidation,
  avatar: avatarValidation,
});

// ============================================
// Type Exports
// ============================================

export type StaffProfileEditInput = z.infer<typeof staffProfileEditSchema>;
