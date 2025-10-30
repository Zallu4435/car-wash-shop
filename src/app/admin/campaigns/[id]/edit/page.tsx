'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AdminRoutes } from '@/lib/constants/routes';
import { Button } from '@/components/ui/button';
import { FormBuilder } from '@/components/shared/crud/FormBuilder';
import { z } from 'zod';
import { toast } from 'sonner';

const campaignSchema = z.object({
  name: z.string().min(3),
  type: z.enum(['email', 'sms', 'push', 'social']),
  startDate: z.string(),
  endDate: z.string(),
  budget: z.number().min(0),
  status: z.enum(['active', 'scheduled', 'completed', 'paused']),
});

export default function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const fields = [
    { name: 'name', label: 'Campaign Name', type: 'text' as const, required: true },
    {
      name: 'type',
      label: 'Campaign Type',
      type: 'select' as const,
      options: [
        { value: 'email', label: 'Email' },
        { value: 'sms', label: 'SMS' },
        { value: 'push', label: 'Push Notification' },
        { value: 'social', label: 'Social Media' },
      ],
      required: true,
    },
    { name: 'startDate', label: 'Start Date', type: 'text' as const, required: true },
    { name: 'endDate', label: 'End Date', type: 'text' as const, required: true },
    { name: 'budget', label: 'Budget (₹)', type: 'number' as const, required: true },
    {
      name: 'status',
      label: 'Status',
      type: 'select' as const,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'scheduled', label: 'Scheduled' },
        { value: 'completed', label: 'Completed' },
        { value: 'paused', label: 'Paused' },
      ],
      required: true,
    },
  ];

  const handleSubmit = (data: any) => {
    toast.success('Campaign updated!');
    router.push(AdminRoutes.CAMPAIGNS);
  };

  return (
    <div className="max-w-2xl">
      <Link href={AdminRoutes.CAMPAIGNS}>
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </Link>
      <FormBuilder
        title={`Edit Campaign - ${id}`}
        fields={fields}
        schema={campaignSchema}
        onSubmit={handleSubmit}
        defaultValues={{ 
          name: 'Summer Sale Campaign', 
          type: 'email', 
          startDate: '2025-10-20', 
          endDate: '2025-11-30', 
          budget: 50000,
          status: 'active'
        }}
        submitLabel="Update Campaign"
      />
    </div>
  );
}
