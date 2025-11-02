'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { slotSchema, SlotFormInput } from '@/schemas/admin/slot';

interface CreateSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSlot: (data: SlotFormInput) => void;
}

export function CreateSlotModal({
  isOpen,
  onClose,
  onCreateSlot,
}: CreateSlotModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SlotFormInput>({
    resolver: zodResolver(slotSchema) as any,
    defaultValues: {
      capacity: 5,
      active: true,
    },
  });

  const handleFormSubmit = (data: SlotFormInput) => {
    onCreateSlot(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-md rounded-xl sm:rounded-2xl">
        <DialogHeader className="space-y-1 sm:space-y-2">
          <DialogTitle className="text-sm sm:text-base lg:text-lg">Create New Time Slot</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Add a new time slot for service bookings
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3 sm:space-y-4 py-2 sm:py-3">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="slot-time" className="text-xs sm:text-sm font-medium">Time Slot</Label>
            <Input
              id="slot-time"
              type="time"
              {...register('time')}
              placeholder="Select time"
              className="h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg"
            />
            {errors.time && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.time.message}</p>
            )}
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="slot-capacity" className="text-xs sm:text-sm font-medium">Capacity</Label>
            <Controller
              name="capacity"
              control={control}
              render={({ field }) => (
                <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                  <SelectTrigger id="slot-capacity" className="h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg">
                    <SelectValue placeholder="Select capacity..." />
                  </SelectTrigger>
                  <SelectContent className="force-sheet-bg border-2 rounded-lg">
                    <SelectItem value="1" className="text-xs sm:text-sm rounded-md">1 booking</SelectItem>
                    <SelectItem value="3" className="text-xs sm:text-sm rounded-md">3 bookings</SelectItem>
                    <SelectItem value="5" className="text-xs sm:text-sm rounded-md">5 bookings</SelectItem>
                    <SelectItem value="10" className="text-xs sm:text-sm rounded-md">10 bookings</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.capacity && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.capacity.message}</p>
            )}
          </div>
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-2 sm:pt-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg" 
              disabled={isSubmitting}
            >
              <Plus className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {isSubmitting ? 'Creating...' : 'Create Slot'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
