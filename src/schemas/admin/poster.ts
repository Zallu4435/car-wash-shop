import { z } from 'zod';

export const posterSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters')
    .trim(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  image: z
    .string()
    .url('Please provide a valid image URL')
    .min(1, 'Image is required'),
  link: z
    .string()
    .url('Please provide a valid link URL')
    .optional()
    .or(z.literal('')),
  active: z.boolean().optional().default(true),
  displayOrder: z
    .number()
    .int('Display order must be a whole number')
    .min(0, 'Display order must be 0 or greater')
    .max(100, 'Display order must not exceed 100')
    .optional(),
  startDate: z
    .string()
    .optional()
    .or(z.literal('')),
  endDate: z
    .string()
    .optional()
    .or(z.literal('')),
});

export type PosterFormInput = z.infer<typeof posterSchema>;
