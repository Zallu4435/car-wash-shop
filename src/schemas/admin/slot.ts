import { z } from 'zod';

const timeRegex = /^([0-1][0-9]|2[0-3]):00$/;

export const slotRangeSchema = z
  .object({
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    weekdayStartTime: z
      .string()
      .min(1, 'Weekday start time is required')
      .regex(timeRegex, 'Use hour-based 24h format (e.g., 06:00)'),
    weekdayEndTime: z
      .string()
      .min(1, 'Weekday end time is required')
      .regex(timeRegex, 'Use hour-based 24h format (e.g., 18:00)'),
    weekendStartTime: z
      .string()
      .min(1, 'Weekend start time is required')
      .regex(timeRegex, 'Use hour-based 24h format (e.g., 09:00)'),
    weekendEndTime: z
      .string()
      .min(1, 'Weekend end time is required')
      .regex(timeRegex, 'Use hour-based 24h format (e.g., 17:00)'),
    makeAvailable: z.boolean().default(true),
  })
  .refine(({ startDate, endDate }) => startDate <= endDate, {
    message: 'End date must be on or after start date',
    path: ['endDate'],
  })
  .refine(({ weekdayStartTime, weekdayEndTime }) => weekdayStartTime < weekdayEndTime, {
    message: 'Weekday end time must be later than start time',
    path: ['weekdayEndTime'],
  })
  .refine(({ weekendStartTime, weekendEndTime }) => weekendStartTime < weekendEndTime, {
    message: 'Weekend end time must be later than start time',
    path: ['weekendEndTime'],
  });

export type SlotRangeFormInput = z.infer<typeof slotRangeSchema>;
