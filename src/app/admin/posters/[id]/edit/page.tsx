'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AdminRoutes } from '@/lib/constants/routes';
import { Button } from '@/components/ui/button';
import { FormBuilder } from '@/components/shared/crud/FormBuilder';
import { toast } from 'sonner';
import { posterSchema } from '@/schemas/admin/poster';

export default function EditPosterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const fields = [
    { name: 'title', label: 'Title', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'image', label: 'Image URL', type: 'text' as const, required: true },
    { name: 'link', label: 'Link URL', type: 'text' as const },
    { name: 'displayOrder', label: 'Display Order', type: 'number' as const },
    { name: 'startDate', label: 'Start Date', type: 'text' as const },
    { name: 'endDate', label: 'End Date', type: 'text' as const },
    { name: 'active', label: 'Active', type: 'switch' as const },
  ];

  const handleSubmit = (data: any) => {
    toast.success('Poster updated!');
    router.push(AdminRoutes.POSTERS);
  };

  return (
    <div className="max-w-2xl">
      <Link href={AdminRoutes.POSTERS}>
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
        defaultValues={{ 
          title: 'Summer Special', 
          description: 'Special summer promotional poster',
          image: 'https://example.com/poster.jpg',
          link: 'https://example.com/offers',
          displayOrder: 1,
          startDate: '2025-10-20', 
          endDate: '2025-11-30', 
          active: true 
        }}
        submitLabel="Update Poster"
      />
    </div>
  );
}
