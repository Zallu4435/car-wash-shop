// components/shared/dialogs/AddAddressDialog.tsx
'use client';

// @ts-nocheck
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useCreateAddress } from '@/api/domains/addresses/queries';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addAddressSchema, AddAddressInput } from '@/schemas/address';

interface AddAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddressAdded: () => void;
}

export function AddAddressDialog({ open, onOpenChange, onAddressAdded }: AddAddressDialogProps) {
  const createAddressMutation = useCreateAddress();

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

  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset(); // Reset form when dialog closes
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-3 sm:pb-4">
          <DialogTitle className="text-base sm:text-lg md:text-xl">Add New Address</DialogTitle>
        </DialogHeader>
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
                  <SelectTrigger id="label" className="h-10 sm:h-11 text-xs sm:text-sm">
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
              className="h-10 sm:h-11 text-xs sm:text-sm"
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
              className="h-10 sm:h-11 text-xs sm:text-sm"
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
                className="h-10 sm:h-11 text-xs sm:text-sm"
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
                className="h-10 sm:h-11 text-xs sm:text-sm"
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
              className="h-10 sm:h-11 text-xs sm:text-sm"
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
              className="h-10 sm:h-11 text-xs sm:text-sm"
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
              className="h-10 sm:h-11 text-xs sm:text-sm"
            />
            {errors.phone && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.phone.message}</p>
            )}
          </div>

          <div className="flex gap-2 pt-2 sm:pt-3">
            <Button 
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-10 sm:h-11 text-xs sm:text-sm"
              disabled={createAddressMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 h-10 sm:h-11 text-xs sm:text-sm shadow-md" 
              disabled={createAddressMutation.isPending}
            >
              {createAddressMutation.isPending ? 'Adding...' : 'Add Address'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
