'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormBuilder } from '@/components/shared/crud/FormBuilder';
import { z } from 'zod';
import { toast } from 'sonner';

const posterSchema = z.object({
  title: z.string().min(5),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  active: z.boolean(),
});

export default function EditPosterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const fields = [
    { name: 'title', label: 'Title', type: 'text' as const, required: true },
    { name: 'location', label: 'Display Location', type: 'text' as const, required: true },
    { name: 'startDate', label: 'Start Date', type: 'text' as const, required: true },
    { name: 'endDate', label: 'End Date', type: 'text' as const, required: true },
    { name: 'active', label: 'Active', type: 'switch' as const },
  ];

  const handleSubmit = (data: any) => {
    toast.success('Poster updated!');
    router.push('/admin/marketing/posters');
  };

  return (
    <div className="max-w-2xl">
      <Link href="/admin/marketing/posters">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </Link>
      <FormBuilder
        title={`Edit Poster - ${id}`}
        fields={fields}
        schema={posterSchema}
        onSubmit={handleSubmit}
        defaultValues={{ title: 'Summer Special', location: 'Home Page', startDate: '2025-10-20', endDate: '2025-11-30', active: true }}
        submitLabel="Update Poster"
      />
    </div>
  );
}
