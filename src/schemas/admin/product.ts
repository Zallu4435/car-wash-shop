import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .min(3, 'Product name must be at least 3 characters')
    .max(100, 'Product name must not exceed 100 characters')
    .trim(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters')
    .trim(),
  category: z
    .string()
    .min(1, 'Please select a category'),
  price: z
    .number()
    .min(1, 'Price must be at least ₹1')
    .max(1000000, 'Price must not exceed ₹10,00,000')
    .positive('Price must be positive'),
  comparePrice: z
    .number()
    .min(0, 'Compare price must be 0 or greater')
    .optional(),
  stock: z
    .number()
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .max(100000, 'Stock must not exceed 1,00,000'),
  sku: z
    .string()
    .min(3, 'SKU must be at least 3 characters')
    .max(50, 'SKU must not exceed 50 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  images: z
    .array(z.string().url('Please provide valid image URLs'))
    .min(1, 'At least one image is required')
    .max(5, 'Maximum 5 images allowed'),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export type ProductFormInput = z.infer<typeof productSchema>;
