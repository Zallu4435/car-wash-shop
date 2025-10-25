import { z } from 'zod';
import { addDays } from 'date-fns';

export const bookingSchema = z.object({
  serviceId: z.string().uuid('Invalid service'),
  vehicleId: z.string().uuid('Please select a vehicle'),
  addOns: z.array(z.string().uuid()).optional(),
  scheduledTime: z
    .string()
    .datetime('Invalid datetime')
    .refine((date) => new Date(date) > new Date(), {
      message: 'Cannot book in the past',
    })
    .refine((date) => new Date(date) < addDays(new Date(), 30), {
      message: 'Cannot book more than 30 days in advance',
    }),
  address: z.object({
    street: z.string().min(5, 'Street address too short'),
    city: z.string().min(2, 'City required'),
    state: z.string().min(2, 'State required'),
    zipCode: z.string().regex(/^\d{6}$/, 'Invalid PIN code'),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  couponCode: z.string().optional(),
  paymentType: z.enum(['full', 'advance'], {
    errorMap: () => ({ message: 'Please select payment type' }),
  }),
  notes: z.string().max(500, 'Notes too long').optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
