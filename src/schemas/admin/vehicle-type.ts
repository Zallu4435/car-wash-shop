import { z } from 'zod';

export const vehicleTypeSchema = z.object({
  name: z
    .string()
    .min(2, 'Vehicle type name must be at least 2 characters')
    .max(50, 'Vehicle type name must not exceed 50 characters')
    .trim(),
  icon: z
    .string()
    .min(1, 'Please provide an icon name')
    .trim(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(200, 'Description must not exceed 200 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  active: z.boolean().optional().default(true),
  displayOrder: z
    .number()
    .int('Display order must be a whole number')
    .min(0, 'Display order must be 0 or greater')
    .max(100, 'Display order must not exceed 100')
    .optional(),
});

export type VehicleTypeFormInput = z.infer<typeof vehicleTypeSchema>;
