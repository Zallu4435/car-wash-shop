'use client';

import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateVehicle } from '@/api/domains/vehicles/queries';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addVehicleSchema, AddVehicleInput } from '@/schemas/customer/vehicle';
import type { Vehicle } from '@/types/vehicle';

interface EditVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
}

const CAR_BODY_TYPES = [
  { id: 'sedan', name: 'Sedan' },
  { id: 'suv', name: 'SUV' },
  { id: 'hatchback', name: 'Hatchback' },
];

const BIKE_BODY_TYPES = [
  { id: 'super-bike', name: 'Super Bike' },
  { id: 'sports-bike', name: 'Sports Bike' },
  { id: 'cruiser', name: 'Cruiser' },
  { id: 'scooty', name: 'Scooty' },
];

export function EditVehicleDialog({ open, onOpenChange, vehicle }: EditVehicleDialogProps) {
  const updateVehicleMutation = useUpdateVehicle();
  const [mounted, setMounted] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AddVehicleInput>({
    resolver: zodResolver(addVehicleSchema) as any,
  });

  const formData = watch();

  // Determine if vehicle is car or bike
  const isCarType = vehicle?.category === 'car';
  const bodyTypes = isCarType ? CAR_BODY_TYPES : BIKE_BODY_TYPES;

  // Populate form when modal opens with vehicle data
  useEffect(() => {
    if (open && vehicle) {
      const formValues = {
        category: vehicle.category || (vehicle.type === 'bike' ? 'bike' : 'car'),
        bodyType: vehicle.bodyType || (vehicle.category === 'car' ? 'sedan' : 'super-bike'),
        isDefault: vehicle.isPrimary,
      };
      reset(formValues);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setValue('category', formValues.category, { shouldValidate: true, shouldDirty: false });
          setValue('bodyType', formValues.bodyType, { shouldValidate: true, shouldDirty: false });
        });
      });
    } else if (!open) {
      reset();
    }
  }, [open, vehicle, reset, setValue]);

  // Handle mounting for animation
  useEffect(() => {
    if (open) {
      setMounted(true);
      setTimeout(() => setShowContent(true), 10);
    } else {
      setShowContent(false);
    }
  }, [open]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [open]);

  const handleTransitionEnd = () => {
    if (!open) setMounted(false);
  };

  const onSubmit = (data: AddVehicleInput) => {
    if (!vehicle) return;
    const currentCategory = vehicle.category || (vehicle.type === 'bike' ? 'bike' : 'car');
    updateVehicleMutation.mutate(
      {
        id: vehicle.id,
        input: {
          category: currentCategory,
          bodyType: data.bodyType,
          isPrimary: data.isDefault,
        },
      },
      {
        onSuccess: () => {
          toast.success('Vehicle updated successfully');
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Failed to update vehicle');
        },
      }
    );
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  if (!mounted && !open) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-md transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'
          }`}
        onClick={handleClose}
      />

      <div
        className={`fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] sm:w-full sm:max-w-md transition-all duration-500 ease-in-out ${showContent
            ? '-translate-x-1/2 -translate-y-1/2 opacity-100 scale-100'
            : '-translate-x-1/2 -translate-y-1/2 opacity-0 scale-95'
          }`}
        onTransitionEnd={handleTransitionEnd}
      >
        <div className="border-2 border-border rounded-lg sm:rounded-xl lg:rounded-2xl shadow-2xl max-h-[92vh] sm:max-h-[90vh] overflow-hidden flex flex-col force-sheet-bg">
          <div className="flex-shrink-0 px-4 sm:px-5 lg:px-6 py-3 sm:py-4 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base lg:text-lg font-bold text-foreground">Edit Vehicle</h2>
              <button onClick={handleClose} className="p-2 hover:bg-muted rounded-xl transition-colors cursor-pointer flex-shrink-0">
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 sm:px-5 lg:px-6 py-4 sm:py-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
              {/* Vehicle Type Display */}
              <div className="p-4 bg-muted/50 rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">Vehicle Type</p>
                <p className="font-medium text-foreground capitalize">{isCarType ? '🚗 Car' : '🏍️ Bike'}</p>
                <p className="text-xs text-muted-foreground mt-1">Type cannot be changed</p>
              </div>

              {/* Vehicle Body Type */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="bodyType" className="text-xs sm:text-sm font-medium">Body Type <span className="text-red-500">*</span></Label>
                <Controller
                  name="bodyType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      key={`bodyType-${vehicle?.id || 'new'}-${open}`}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="bodyType" className="h-9 sm:h-10 lg:h-11 text-xs sm:text-sm border-2">
                        <SelectValue placeholder="Select body type" />
                      </SelectTrigger>
                      <SelectContent>
                        {bodyTypes.map((bodyType) => (
                          <SelectItem key={bodyType.id} value={bodyType.id}>
                            {bodyType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.bodyType && (
                  <p className="text-xs text-red-600 dark:text-red-400">{String(errors.bodyType.message)}</p>
                )}
              </div>

              {/* Primary Vehicle Checkbox */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center space-x-2">
                  <Controller
                    name="isDefault"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={field.value || false}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 rounded border-2 border-border text-primary focus:ring-primary"
                      />
                    )}
                  />
                  <Label htmlFor="isDefault" className="text-xs sm:text-sm font-medium cursor-pointer">
                    Set as primary vehicle
                  </Label>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2 sm:pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 h-9 sm:h-10 lg:h-11 text-xs sm:text-sm border-2"
                  disabled={updateVehicleMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-9 sm:h-10 lg:h-11 text-xs sm:text-sm border-2"
                  disabled={updateVehicleMutation.isPending}
                >
                  {updateVehicleMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
