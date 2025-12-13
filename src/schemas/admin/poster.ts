import { z } from 'zod';

export const posterSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  image: z
    .string()
    .min(1, 'Image is required'),
  endDate: z
    .string()
    .min(1, 'End date is required'),
  headingColor: z
    .string()
    .optional()
    .default('#ffffff'),
  descriptionColor: z
    .string()
    .optional()
    .default('#ffffff'),
  showButton: z
    .boolean()
    .optional()
    .default(false),
  buttonText: z
    .string()
    .max(50, 'Button text must not exceed 50 characters')
    .optional()
    .or(z.literal('')),
  buttonLink: z
    .string()
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

export type PosterFormInput = z.infer<typeof posterSchema>;

