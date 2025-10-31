import { z } from 'zod';

export const vehicleModelSchema = z.object({
  name: z
    .string()
    .min(2, 'Model name must be at least 2 characters')
    .max(100, 'Model name must not exceed 100 characters')
    .trim(),
  brand: z
    .string()
    .min(1, 'Please select a brand'),
  bodyType: z
    .string()
    .min(1, 'Please select a body type'),
  vehicleType: z
    .enum(['4-Wheeler', '2-Wheeler'], {
      message: 'Please select a vehicle type',
    }),
  year: z
    .number()
    .int('Year must be a whole number')
    .min(1990, 'Year must be 1990 or later')
    .max(new Date().getFullYear() + 2, `Year cannot exceed ${new Date().getFullYear() + 2}`)
    .optional(),
  fuelType: z
    .enum(['petrol', 'diesel', 'electric', 'hybrid', 'cng'], {
      message: 'Please select a fuel type',
    })
    .optional(),
  image: z
    .string()
    .url('Please provide a valid image URL')
    .optional()
    .or(z.literal('')),
  active: z.boolean().optional().default(true),
  popular: z.boolean().optional().default(false),
});

export type VehicleModelFormInput = z.infer<typeof vehicleModelSchema>;
