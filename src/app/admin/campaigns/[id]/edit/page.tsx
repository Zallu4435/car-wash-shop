'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AdminRoutes } from '@/lib/constants/routes';
import { Button } from '@/components/ui/button';
import { FormBuilder } from '@/components/shared/crud/FormBuilder';
import { toast } from 'sonner';
import { campaignSchema } from '@/schemas/admin/campaign';

export default function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const fields = [
    { name: 'name', label: 'Campaign Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const, required: true },
    {
      name: 'type',
      label: 'Campaign Type',
      type: 'select' as const,
      options: [
        { value: 'email', label: 'Email' },
        { value: 'sms', label: 'SMS' },
        { value: 'notification', label: 'Notification' },
        { value: 'banner', label: 'Banner' },
      ],
      required: true,
    },
    {
      name: 'targetAudience',
      label: 'Target Audience',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Users' },
        { value: 'active', label: 'Active Users' },
        { value: 'inactive', label: 'Inactive Users' },
        { value: 'new', label: 'New Users' },
      ],
      required: true,
    },
    { name: 'startDate', label: 'Start Date', type: 'text' as const, required: true },
    { name: 'endDate', label: 'End Date', type: 'text' as const, required: true },
    { name: 'budget', label: 'Budget (₹)', type: 'number' as const },
    { name: 'active', label: 'Active', type: 'switch' as const },
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
          description: 'Promotional campaign for summer season with special discounts',
          type: 'email', 
          targetAudience: 'all',
          startDate: '2025-10-20', 
          endDate: '2025-11-30', 
          budget: 50000,
          active: true
        }}
        submitLabel="Update Campaign"
      />
    </div>
  );
}
