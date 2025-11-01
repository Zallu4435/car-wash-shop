'use client';

import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormBuilder } from '@/components/shared/crud/FormBuilder';
import { toast } from 'sonner';
import { vehicleTypeSchema } from '@/schemas/admin/vehicle-type';

export default function EditVehicleTypePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const fields = [
    { name: 'name', label: 'Vehicle Type Name', type: 'text' as const, required: true },
    { name: 'icon', label: 'Icon Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const },
    { name: 'displayOrder', label: 'Display Order', type: 'number' as const },
    { name: 'active', label: 'Active', type: 'switch' as const },
  ];

  const handleSubmit = (data: any) => {
    console.log('Updating vehicle type:', id, data);
    toast.success('Vehicle type updated successfully!');
    router.push('/admin/vehicles/types');
  };

  return (
    <div className="max-w-2xl">
      <Link href="/admin/vehicles/types">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </Link>
      <FormBuilder
        title={`Edit Vehicle Type - ${id}`}
        fields={fields}
        schema={vehicleTypeSchema}
        onSubmit={handleSubmit}
        defaultValues={{
          name: '4-Wheeler',
          icon: 'Car',
          description: 'Four-wheeled vehicles',
          displayOrder: 1,
          active: true,
        }}
        submitLabel="Update Vehicle Type"
      />
    </div>
  );
}
