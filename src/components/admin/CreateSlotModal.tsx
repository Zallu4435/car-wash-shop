'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { slotRangeSchema, SlotRangeFormInput } from '@/schemas/admin/slot';
import { Input } from '@/components/ui/input';

interface CreateSlotModalProps {
  isOpen: boolean;
  selectedDate?: string;
  onClose: () => void;
  onGenerate: (data: SlotRangeFormInput) => void;
}

const HOURS = Array.from({ length: 17 }, (_, idx) => idx + 6).map((hour) =>
  `${hour.toString().padStart(2, '0')}:00`
);

export function CreateSlotModal({
  isOpen,
  selectedDate,
  onClose,
  onGenerate,
}: CreateSlotModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SlotRangeFormInput>({
    resolver: zodResolver(slotRangeSchema) as any,
    defaultValues: {
      capacity: 1,
    },
  });

  useEffect(() => {
    register('startTime');
    register('endTime');
  }, [register]);

  const startTime = watch('startTime');
  const endTime = watch('endTime');

  useEffect(() => {
    if (isOpen) {
      reset({
        date: selectedDate || '',
        startTime: '06:00',
        endTime: '12:00',
        capacity: 1,
      });
    }
  }, [isOpen, selectedDate, reset]);

  const handleFormSubmit = (data: SlotRangeFormInput) => {
    onGenerate(data);
    reset({
      date: selectedDate || '',
      startTime: '06:00',
      endTime: '12:00',
      capacity: 1,
    });
  };

  const handleClose = () => {
    reset({
      date: selectedDate || '',
      startTime: '06:00',
      endTime: '12:00',
      capacity: 1,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-md rounded-xl sm:rounded-2xl">
        <DialogHeader className="space-y-1 sm:space-y-2">
          <DialogTitle className="text-sm sm:text-base lg:text-lg">Generate Slots</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Choose a time range to create hourly slots. Newly generated slots start as unavailable.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3 sm:space-y-4 py-2 sm:py-3">
          <div className="space-y-1.5 sm:space-y-2">
            <Label className="text-xs sm:text-sm font-medium">Selected Date</Label>
            <Input
              readOnly
              value={selectedDate || ''}
              placeholder="Pick a date on the calendar"
              className="h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg bg-muted"
              {...register('date')}
            />
            {errors.date && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.date.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm font-medium">Start Time</Label>
              <Select
                value={startTime || '06:00'}
                onValueChange={(value) => setValue('startTime', value, { shouldValidate: true })}
              >
                <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg">
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent className="force-sheet-bg border-2 rounded-lg max-h-60">
                  {HOURS.map((hour) => (
                    <SelectItem key={hour} value={hour} className="text-xs sm:text-sm rounded-md">
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.startTime && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.startTime.message}</p>
              )}
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm font-medium">End Time</Label>
              <Select
                value={endTime || '12:00'}
                onValueChange={(value) => setValue('endTime', value, { shouldValidate: true })}
              >
                <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg">
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent className="force-sheet-bg border-2 rounded-lg max-h-60">
                  {HOURS.filter((hour) => !startTime || hour > startTime).map((hour) => (
                    <SelectItem key={hour} value={hour} className="text-xs sm:text-sm rounded-md">
                      {hour}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.endTime && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.endTime.message}</p>
              )}
            </div>
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
              {isSubmitting ? 'Generating...' : 'Generate Slots'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
