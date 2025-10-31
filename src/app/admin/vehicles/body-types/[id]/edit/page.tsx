'use client';

import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { vehicleBodyTypeSchema, VehicleBodyTypeFormInput } from '@/schemas/admin/vehicle-body-type';
import { useEffect } from 'react';

export default function EditBodyTypePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VehicleBodyTypeFormInput>({
    resolver: zodResolver(vehicleBodyTypeSchema) as any,
    defaultValues: {
      active: true,
    },
  });

  useEffect(() => {
    const fetchBodyType = async () => {
      try {
        // TODO: Replace with actual API call
        const existingData = {
          name: 'Sedan',
          vehicleType: '4-Wheeler' as const,
          icon: 'Car',
          description: 'Four-door passenger car',
          active: true,
          displayOrder: 1,
        };
        
        reset(existingData);
      } catch (error) {
        toast.error('Failed to load body type');
      }
    };

    fetchBodyType();
  }, [id, reset]);

  const onSubmit = async (data: VehicleBodyTypeFormInput) => {
    try {
      console.log('Updating body type:', id, data);
      toast.success('Body type updated successfully!');
      router.push('/admin/vehicles/body-types');
    } catch (error) {
      toast.error('Failed to update body type');
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Button variant="ghost" onClick={() => router.push('/admin/vehicles/body-types')} className="cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Body Types
        </Button>
      </div>

      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Layers className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Edit Body Type</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Update body type details</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Body Type Name</Label>
              <Input 
                id="name" 
                placeholder="e.g., Sedan, SUV, Hatchback" 
                {...register('name')}
              />
              {errors.name && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Controller
                name="vehicleType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="vehicleType">
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4-Wheeler">4-Wheeler</SelectItem>
                      <SelectItem value="2-Wheeler">2-Wheeler</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.vehicleType && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.vehicleType.message}</p>
              )}
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="description">Description <span className="text-xs text-muted-foreground">(Optional)</span></Label>
              <Textarea
                id="description"
                placeholder="Describe this body type..."
                rows={3}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.description.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div>
                <Label htmlFor="active" className="cursor-pointer">Active Status</Label>
                <p className="text-xs text-muted-foreground mt-1">Body type is available for selection</p>
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

            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1" 
                onClick={() => router.push('/admin/vehicles/body-types')}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 shadow-lg" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
