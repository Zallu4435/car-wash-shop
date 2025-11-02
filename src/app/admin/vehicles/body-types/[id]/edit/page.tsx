'use client';

import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormBuilder } from '@/components/shared/crud/FormBuilder';
import { toast } from 'sonner';
import { vehicleBodyTypeSchema } from '@/schemas/admin/vehicle-body-type';

export default function EditBodyTypePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const fields = [
    { name: 'name', label: 'Body Type Name', type: 'text' as const, required: true },
    {
      name: 'vehicleType',
      label: 'Vehicle Type',
      type: 'select' as const,
      options: [
        { value: '4-Wheeler', label: '4-Wheeler' },
        { value: '2-Wheeler', label: '2-Wheeler' },
      ],
      required: true,
    },
    { name: 'icon', label: 'Icon Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'displayOrder', label: 'Display Order', type: 'number' as const },
    { name: 'active', label: 'Active', type: 'switch' as const },
  ];

  const handleSubmit = (data: any) => {
    console.log('Updating body type:', id, data);
    toast.success('Body type updated successfully!');
    router.push('/admin/vehicles/body-types');
  };

  return (
    <div className="max-w-2xl space-y-4 sm:space-y-6 pb-6">
      <div>
        <Link href="/admin/vehicles/body-types">
          <Button variant="ghost" className="w-fit h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2 -ml-2">
            <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Back to Body Types
          </Button>
        </Link>
      </div>
      <FormBuilder
        title={`Edit Body Type - ${id}`}
        fields={fields}
        schema={vehicleBodyTypeSchema}
        onSubmit={handleSubmit}
        defaultValues={{
          name: 'Sedan',
          vehicleType: '4-Wheeler',
          icon: 'Car',
          description: 'Four-door passenger car',
          displayOrder: 1,
          active: true,
        }}
        submitLabel="Update Body Type"
      />
    </div>
  );
}
