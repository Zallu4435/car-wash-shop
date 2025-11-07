import { z } from 'zod';

export const slotRangeSchema = z
  .object({
    date: z.string().min(1, 'Please select a date'),
    startTime: z
      .string()
      .min(1, 'Start time is required')
      .regex(/^([0-1][0-9]|2[0-3]):00$/, 'Use hour-based 24h format (e.g., 06:00)'),
    endTime: z
      .string()
      .min(1, 'End time is required')
      .regex(/^([0-1][0-9]|2[0-3]):00$/, 'Use hour-based 24h format (e.g., 18:00)'),
    capacity: z
      .number()
      .int('Capacity must be a whole number')
      .min(1, 'Capacity must be at least 1')
      .max(50, 'Capacity must not exceed 50')
      .optional()
      .default(1),
  })
  .refine(({ startTime, endTime }) => startTime < endTime, {
    message: 'End time must be later than start time',
    path: ['endTime'],
  });

export type SlotRangeFormInput = z.infer<typeof slotRangeSchema>;
