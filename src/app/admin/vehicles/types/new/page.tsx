'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { vehicleTypeSchema, VehicleTypeFormInput } from '@/schemas/admin/vehicle-type';

export default function NewVehicleTypePage() {
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<VehicleTypeFormInput>({
    resolver: zodResolver(vehicleTypeSchema) as any,
    defaultValues: {
      active: true,
    },
  });

  const onSubmit = async (data: VehicleTypeFormInput) => {
    try {
      console.log('Vehicle type data:', data);
      toast.success('Vehicle type created successfully!');
      router.push('/admin/vehicles/types');
    } catch (error) {
      toast.error('Failed to create vehicle type');
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push('/admin/vehicles/types')} className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Vehicle Types
        </Button>
      </div>

      {/* Form */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Add New Vehicle Type</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Add a new vehicle type category</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Vehicle Type Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Vehicle Type Name</Label>
              <Input 
                id="name" 
                placeholder="e.g., 4-Wheeler, 2-Wheeler" 
                {...register('name')}
              />
              {errors.name && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>

            {/* Icon & Display Order */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon Name</Label>
                <Input 
                  id="icon" 
                  placeholder="e.g., Car, Bike" 
                  {...register('icon')}
                />
                {errors.icon && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errors.icon.message}</p>
                )}
                {!errors.icon && (
                  <p className="text-xs text-muted-foreground">Enter a Lucide icon name</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayOrder">Display Order <span className="text-xs text-muted-foreground">(Optional)</span></Label>
                <Input 
                  id="displayOrder" 
                  type="number" 
                  placeholder="1" 
                  {...register('displayOrder', { valueAsNumber: true })}
                />
                {errors.displayOrder && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errors.displayOrder.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description <span className="text-xs text-muted-foreground">(Optional)</span></Label>
              <Textarea
                id="description"
                placeholder="Describe this vehicle type..."
                rows={3}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.description.message}</p>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div>
                <Label htmlFor="active" className="cursor-pointer">Active Status</Label>
                <p className="text-xs text-muted-foreground mt-1">Vehicle type is available for selection</p>
              </div>
              <Controller
                name="active"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full shadow-lg" size="lg" disabled={isSubmitting}>
              <Plus className="mr-2 h-5 w-5" />
              {isSubmitting ? 'Creating...' : 'Create Vehicle Type'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
