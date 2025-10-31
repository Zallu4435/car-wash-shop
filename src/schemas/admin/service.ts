import { z } from 'zod';

export const serviceSchema = z.object({
  name: z
    .string()
    .min(3, 'Service name must be at least 3 characters')
    .max(100, 'Service name must not exceed 100 characters')
    .trim(),
  category: z
    .string()
    .min(1, 'Please select a category'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters')
    .trim(),
  price: z
    .number()
    .min(1, 'Price must be at least ₹1')
    .max(100000, 'Price must not exceed ₹1,00,000')
    .positive('Price must be positive'),
  duration: z
    .number()
    .min(5, 'Duration must be at least 5 minutes')
    .max(480, 'Duration must not exceed 8 hours')
    .positive('Duration must be positive'),
  vehicleType: z
    .string()
    .min(1, 'Please select a vehicle type'),
  active: z.boolean().optional().default(true),
  image: z
    .string()
    .url('Please provide a valid image URL')
    .optional()
    .or(z.literal('')),
});

export type ServiceFormInput = z.infer<typeof serviceSchema>;
