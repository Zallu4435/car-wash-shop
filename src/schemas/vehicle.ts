import { z } from 'zod';

export const vehicleSchema = z.object({
  brandId: z.string().uuid('Please select a brand'),
  modelId: z.string().uuid('Please select a model'),
  year: z
    .number()
    .int()
    .min(1990, 'Vehicle too old')
    .max(new Date().getFullYear() + 1, 'Invalid year'),
  plateNumber: z
    .string()
    .regex(/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/, 'Invalid plate format (e.g., MH12AB1234)')
    .optional()
    .or(z.literal('')),
  color: z.string().min(2).optional().or(z.literal('')),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;
