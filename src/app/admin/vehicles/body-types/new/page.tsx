'use client';

import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Plus, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { vehicleBodyTypeSchema, VehicleBodyTypeFormInput } from '@/schemas/admin/vehicle-body-type';

export default function NewBodyTypePage() {
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<VehicleBodyTypeFormInput>({
    resolver: zodResolver(vehicleBodyTypeSchema) as any,
    defaultValues: {
      active: true,
    },
  });

  const onSubmit = async (data: VehicleBodyTypeFormInput) => {
    try {
      console.log('Body type data:', data);
      toast.success('Body type created successfully!');
      router.push('/admin/vehicles/body-types');
    } catch (error) {
      toast.error('Failed to create body type');
    }
  };

  return (
    <div className="max-w-2xl space-y-4 sm:space-y-6 pb-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.push('/admin/vehicles/body-types')} className="w-fit h-9 sm:h-10 text-xs sm:text-sm cursor-pointer border-2 -ml-2">
          <ArrowLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Back to Body Types
        </Button>
      </div>

      {/* Form */}
      <Card className="border-2 border-border rounded-lg sm:rounded-xl">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-2.5 md:p-3 bg-primary/10 rounded-lg sm:rounded-xl border-2 border-primary/20 flex-shrink-0">
              <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg md:text-xl">Add New Body Type</CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Add a new vehicle body type</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Body Type Name */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="name" className="text-xs sm:text-sm">Body Type Name</Label>
              <Input 
                id="name" 
                placeholder="e.g., Sedan, SUV, Hatchback" 
                className="h-9 sm:h-10 text-xs sm:text-sm"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>

            {/* Vehicle Type */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="vehicleType" className="text-xs sm:text-sm">Vehicle Type</Label>
              <Controller
                name="vehicleType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="vehicleType" className="h-9 sm:h-10 text-xs sm:text-sm">
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
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.vehicleType.message}</p>
              )}
            </div>

            {/* Icon & Display Order */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="icon" className="text-xs sm:text-sm">Icon Name</Label>
                <Input 
                  id="icon" 
                  placeholder="e.g., Car, Bike" 
                  className="h-9 sm:h-10 text-xs sm:text-sm"
                  {...register('icon')}
                />
                {errors.icon && (
                  <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.icon.message}</p>
                )}
                {!errors.icon && (
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Enter a Lucide icon name</p>
                )}
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="displayOrder" className="text-xs sm:text-sm">Display Order <span className="text-[10px] sm:text-xs text-muted-foreground">(Optional)</span></Label>
                <Input 
                  id="displayOrder" 
                  type="number" 
                  placeholder="1" 
                  className="h-9 sm:h-10 text-xs sm:text-sm"
                  {...register('displayOrder', { valueAsNumber: true })}
                />
                {errors.displayOrder && (
                  <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.displayOrder.message}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="description" className="text-xs sm:text-sm">Description <span className="text-[10px] sm:text-xs text-muted-foreground">(Optional)</span></Label>
              <Textarea
                id="description"
                placeholder="Describe this body type..."
                rows={3}
                className="text-xs sm:text-sm resize-none"
                {...register('description')}
              />
              {errors.description && (
                <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400">{errors.description.message}</p>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center justify-between p-3 sm:p-4 bg-muted rounded-lg sm:rounded-xl border-2 border-border">
              <div className="min-w-0 flex-1 mr-3">
                <Label htmlFor="active" className="cursor-pointer text-xs sm:text-sm">Active Status</Label>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Body type is available for selection</p>
              </div>
              <Controller
                name="active"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="flex-shrink-0"
                  />
                )}
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full shadow-lg h-10 sm:h-11 text-xs sm:text-sm border-2" disabled={isSubmitting}>
              <Plus className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              {isSubmitting ? 'Creating...' : 'Create Body Type'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
