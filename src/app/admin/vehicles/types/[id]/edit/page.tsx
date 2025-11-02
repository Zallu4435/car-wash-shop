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
    <div className="max-w-2xl space-y-4 sm:space-y-6 pb-6">
      <div>
        <Link href="/admin/vehicles/types">
          <Button variant="ghost" className="w-fit h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2 -ml-2">
            <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Back to Vehicle Types
          </Button>
        </Link>
      </div>
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
