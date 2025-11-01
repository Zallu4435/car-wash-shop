// components/shared/dialogs/AddAddressDialog.tsx
'use client';

// @ts-nocheck
import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateAddress } from '@/api/domains/addresses/queries';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addAddressSchema, AddAddressInput } from '@/schemas/customer/address';
import { useState } from 'react';

interface AddAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddressAdded: () => void;
}

export function AddAddressDialog({ open, onOpenChange, onAddressAdded }: AddAddressDialogProps) {
  const createAddressMutation = useCreateAddress();
  const [mounted, setMounted] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<AddAddressInput>({
    resolver: zodResolver(addAddressSchema) as any,
    defaultValues: {
      isDefault: false,
    },
  });

  // Handle mounting for animation
  useEffect(() => {
    if (open) {
      setMounted(true);
      // Small delay to trigger animation
      setTimeout(() => {
        setShowContent(true);
      }, 10);
    } else {
      setShowContent(false);
    }
  }, [open]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [open]);

  // Handle unmounting after animation
  const handleTransitionEnd = () => {
    if (!open) {
      setMounted(false);
    }
  };

  const onSubmit = (data: AddAddressInput) => {
    createAddressMutation.mutate(
      {
        label: data.label,
        line1: data.addressLine1,
        line2: data.addressLine2 || undefined,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        landmark: data.landmark || undefined,
        phone: data.phone || undefined,
      },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
          onAddressAdded();
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Failed to add address');
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
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-md transition-opacity duration-500 ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div 
        className={`fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] sm:w-full sm:max-w-md transition-all duration-500 ease-in-out ${
          showContent 
            ? '-translate-x-1/2 -translate-y-1/2 opacity-100 scale-100' 
            : '-translate-x-1/2 -translate-y-1/2 opacity-0 scale-95'
        }`}
        onTransitionEnd={handleTransitionEnd}
      >
        <div className="border-2 border-border rounded-lg sm:rounded-xl lg:rounded-2xl shadow-2xl max-h-[92vh] sm:max-h-[90vh] overflow-hidden flex flex-col force-sheet-bg">
          {/* Header */}
          <div className="flex-shrink-0 px-4 sm:px-5 lg:px-6 py-3 sm:py-4 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base lg:text-lg font-bold text-foreground">Add New Address</h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-muted rounded-xl transition-colors cursor-pointer flex-shrink-0"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-5 lg:px-6 py-4 sm:py-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="label" className="text-xs sm:text-sm font-medium">
              Label <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="label"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="label" className="h-9 sm:h-10 lg:h-11 text-xs sm:text-sm border-2">
                    <SelectValue placeholder="Select label" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.label && (
              <p className="text-xs text-red-600 dark:text-red-400">{String(errors.label.message)}</p>
            )}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="addressLine1" className="text-xs sm:text-sm font-medium">
              Address Line 1 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="addressLine1"
              placeholder="House/Flat No., Street Name"
              {...register('addressLine1')}
              className="h-9 sm:h-10 lg:h-11 text-xs sm:text-sm border-2"
            />
            {errors.addressLine1 && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.addressLine1.message}</p>
            )}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="addressLine2" className="text-xs sm:text-sm font-medium">
              Address Line 2 <span className="text-xs text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="addressLine2"
              placeholder="Area, Locality"
              {...register('addressLine2')}
              className="h-9 sm:h-10 lg:h-11 text-xs sm:text-sm border-2"
            />
            {errors.addressLine2 && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.addressLine2.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="city" className="text-xs sm:text-sm font-medium">
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                placeholder="City"
                {...register('city')}
                className="h-9 sm:h-10 lg:h-11 text-xs sm:text-sm border-2"
              />
              {errors.city && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.city.message}</p>
              )}
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="state" className="text-xs sm:text-sm font-medium">
                State <span className="text-red-500">*</span>
              </Label>
              <Input
                id="state"
                placeholder="State"
                {...register('state')}
                className="h-9 sm:h-10 lg:h-11 text-xs sm:text-sm border-2"
              />
              {errors.state && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.state.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="pincode" className="text-xs sm:text-sm font-medium">
              Pincode <span className="text-red-500">*</span>
            </Label>
            <Input
              id="pincode"
              placeholder="6-digit pincode"
              {...register('pincode')}
              maxLength={6}
              className="h-9 sm:h-10 lg:h-11 text-xs sm:text-sm border-2"
            />
            {errors.pincode && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.pincode.message}</p>
            )}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="landmark" className="text-xs sm:text-sm font-medium">
              Landmark <span className="text-xs text-muted-foreground">(Optional)</span>
            </Label>
            <Input 
              id="landmark" 
              placeholder="e.g., Near Metro Station"
              {...register('landmark')}
              className="h-9 sm:h-10 lg:h-11 text-xs sm:text-sm border-2"
            />
            {errors.landmark && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.landmark.message}</p>
            )}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="phone" className="text-xs sm:text-sm font-medium">
              Phone <span className="text-xs text-muted-foreground">(Optional)</span>
            </Label>
            <Input 
              id="phone" 
              placeholder="10-digit mobile number"
              {...register('phone')}
              maxLength={10}
              className="h-9 sm:h-10 lg:h-11 text-xs sm:text-sm border-2"
            />
            {errors.phone && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.phone.message}</p>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2 sm:pt-3">
            <Button 
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-9 sm:h-10 lg:h-11 text-xs sm:text-sm border-2"
              disabled={createAddressMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 h-9 sm:h-10 lg:h-11 text-xs sm:text-sm shadow-md border-2" 
              disabled={createAddressMutation.isPending}
            >
              {createAddressMutation.isPending ? 'Adding...' : 'Add Address'}
            </Button>
          </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
