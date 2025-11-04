'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
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
import { mockVehicleBrands } from '@/mocks/data/customer-mock-data';

interface EditVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
}

const CAR_CATEGORIES = [
  { id: 'hatchback', name: 'Hatchback' },
  { id: 'sedan', name: 'Sedan' },
  { id: 'suv', name: 'SUV' },
  { id: 'car', name: 'Car' },
];

const BIKE_CATEGORIES = [
  { id: 'bike', name: 'Bike' },
];

export function EditVehicleDialog({ open, onOpenChange, vehicle }: EditVehicleDialogProps) {
  const updateVehicleMutation = useUpdateVehicle();
  const [mounted, setMounted] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AddVehicleInput>({
    resolver: zodResolver(addVehicleSchema) as any,
  });

  const formData = watch();
  const vehicleType = formData.type;

  // Determine if vehicle is car-like or bike
  const isCarType = vehicle && ['car', 'hatchback', 'sedan', 'suv'].includes(vehicle.type);
  const categories = isCarType ? CAR_CATEGORIES : BIKE_CATEGORIES;

  // Populate form when vehicle changes
  useEffect(() => {
    if (vehicle) {
      setValue('type', vehicle.type);
      setValue('brand', vehicle.brand || '');
      setValue('model', vehicle.model || '');
      setValue('year', vehicle.year.toString());
      setValue('plateNumber', vehicle.plateNumber || '');
      setValue('color', vehicle.color || '');
      setValue('fuelType', vehicle.fuelType || 'petrol');
      setValue('isDefault', vehicle.isPrimary);
    } else {
      reset();
    }
  }, [vehicle, reset, setValue]);

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
    updateVehicleMutation.mutate(
      {
        id: vehicle.id,
        input: {
          type: data.type,
          brand: data.brand,
          model: data.model,
          year: data.year,
          plateNumber: data.plateNumber,
          color: data.color || undefined,
          fuelType: data.fuelType || undefined,
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
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-md transition-opacity duration-500 ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      <div 
        className={`fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] sm:w-full sm:max-w-md transition-all duration-500 ease-in-out ${
          showContent 
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
              {/* Vehicle Type */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="type" className="text-xs sm:text-sm font-medium">Vehicle Type <span className="text-red-500">*</span></Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="type" className="h-9 sm:h-10 lg:h-11 text-xs sm:text-sm border-2">
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && (
                  <p className="text-xs text-red-600 dark:text-red-400">{String(errors.type.message)}</p>
                )}
              </div>

              {/* Brand */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="brand" className="text-xs sm:text-sm font-medium">Brand <span className="text-red-500">*</span></Label>
                <Controller
                  name="brand"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="brand" className="h-9 sm:h-10 lg:h-11 text-xs sm:text-sm border-2">
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockVehicleBrands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.name}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.brand && (
                  <p className="text-xs text-red-600 dark:text-red-400">{String(errors.brand.message)}</p>
                )}
              </div>

              {/* Model */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="model" className="text-xs sm:text-sm font-medium">Model <span className="text-red-500">*</span></Label>
                <Input 
                  id="model" 
                  placeholder="e.g., City, Swift, Classic 350" 
                  {...register('model')} 
                  className="h-9 sm:h-10 lg:h-11 text-xs sm:text-sm border-2" 
                />
                {errors.model && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errors.model.message}</p>
                )}
              </div>

              {/* Plate Number */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="plateNumber" className="text-xs sm:text-sm font-medium">Plate Number <span className="text-red-500">*</span></Label>
                <Input 
                  id="plateNumber" 
                  placeholder="e.g., MH12AB1234" 
                  {...register('plateNumber')} 
                  className="h-9 sm:h-10 lg:h-11 text-xs sm:text-sm border-2 font-mono uppercase"
                  onChange={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                    register('plateNumber').onChange(e);
                  }}
                />
                {errors.plateNumber && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errors.plateNumber.message}</p>
                )}
              </div>

              {/* Year and Color */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="year" className="text-xs sm:text-sm font-medium">Year <span className="text-red-500">*</span></Label>
                  <Input 
                    id="year" 
                    placeholder="YYYY" 
                    {...register('year')} 
                    maxLength={4}
                    className="h-9 sm:h-10 lg:h-11 text-xs sm:text-sm border-2" 
                  />
                  {errors.year && (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.year.message}</p>
                  )}
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="color" className="text-xs sm:text-sm font-medium">Color <span className="text-xs text-muted-foreground">(Optional)</span></Label>
                  <Input 
                    id="color" 
                    placeholder="e.g., White" 
                    {...register('color')} 
                    className="h-9 sm:h-10 lg:h-11 text-xs sm:text-sm border-2" 
                  />
                  {errors.color && (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.color.message}</p>
                  )}
                </div>
              </div>

              {/* Fuel Type */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="fuelType" className="text-xs sm:text-sm font-medium">Fuel Type <span className="text-xs text-muted-foreground">(Optional)</span></Label>
                <Controller
                  name="fuelType"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value || 'petrol'} onValueChange={field.onChange}>
                      <SelectTrigger id="fuelType" className="h-9 sm:h-10 lg:h-11 text-xs sm:text-sm border-2">
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="petrol">Petrol</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                        <SelectItem value="electric">Electric</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="cng">CNG</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.fuelType && (
                  <p className="text-xs text-red-600 dark:text-red-400">{String(errors.fuelType.message)}</p>
                )}
              </div>

              {/* Primary Vehicle Checkbox */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    {...register('isDefault')}
                    className="h-4 w-4 rounded border-2 border-border text-primary focus:ring-primary"
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

