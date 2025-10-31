import { z } from 'zod';

export const campaignSchema = z.object({
  name: z
    .string()
    .min(3, 'Campaign name must be at least 3 characters')
    .max(100, 'Campaign name must not exceed 100 characters')
    .trim(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters')
    .trim(),
  type: z
    .enum(['email', 'sms', 'notification', 'banner'], {
      message: 'Please select a campaign type',
    }),
  targetAudience: z
    .enum(['all', 'active', 'inactive', 'new'], {
      message: 'Please select target audience',
    }),
  startDate: z
    .string()
    .min(1, 'Start date is required'),
  endDate: z
    .string()
    .min(1, 'End date is required'),
  budget: z
    .number()
    .min(0, 'Budget cannot be negative')
    .max(10000000, 'Budget must not exceed ₹1,00,00,000')
    .optional(),
  active: z.boolean().optional().default(true),
});

export type CampaignFormInput = z.infer<typeof campaignSchema>;
