import { z } from 'zod';

export const slotSchema = z.object({
  time: z
    .string()
    .min(1, 'Please select a time')
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  capacity: z
    .number()
    .int('Capacity must be a whole number')
    .min(1, 'Capacity must be at least 1')
    .max(50, 'Capacity must not exceed 50'),
  date: z
    .string()
    .optional(),
  active: z.boolean().optional().default(true),
});

export type SlotFormInput = z.infer<typeof slotSchema>;
