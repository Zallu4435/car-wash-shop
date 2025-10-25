'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormBuilder } from '@/components/shared/crud/FormBuilder';
import { z } from 'zod';
import { toast } from 'sonner';

const modelSchema = z.object({
  brandId: z.string().min(1),
  name: z.string().min(2),
  active: z.boolean(),
});

export default function NewModelPage() {
  const router = useRouter();

  const fields = [
    {
      name: 'brandId',
      label: 'Brand',
      type: 'select' as const,
      options: [
        { value: 'brand_001', label: 'Toyota' },
        { value: 'brand_002', label: 'Honda' },
        { value: 'brand_003', label: 'Maruti Suzuki' },
      ],
      required: true,
    },
    { name: 'name', label: 'Model Name', type: 'text' as const, placeholder: 'e.g., Camry', required: true },
    { name: 'active', label: 'Active', type: 'switch' as const, defaultValue: true },
  ];

  const handleSubmit = (data: any) => {
    toast.success('Model added successfully!');
    router.push('/vehicles/models');
  };

  return (
    <div className="max-w-2xl">
      <Link href="/vehicles/models">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Models
        </Button>
      </Link>
      <FormBuilder
        title="Add New Model"
        fields={fields}
        schema={modelSchema}
        onSubmit={handleSubmit}
        defaultValues={{ active: true }}
        submitLabel="Add Model"
      />
    </div>
  );
}
