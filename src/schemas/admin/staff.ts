import { z } from 'zod';

export const staffSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number')
    .length(10, 'Phone number must be exactly 10 digits'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must not exceed 100 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .optional()
    .or(z.literal('')),
  active: z.boolean().optional().default(true),
  avatar: z
    .string()
    .url('Please provide a valid avatar URL')
    .optional()
    .or(z.literal('')),
});

export const staffEditSchema = staffSchema.extend({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must not exceed 100 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .optional()
    .or(z.literal('')),
});

export type StaffFormInput = z.infer<typeof staffSchema>;
export type StaffEditFormInput = z.infer<typeof staffEditSchema>;
