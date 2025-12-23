'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { slotRangeSchema, SlotRangeFormInput } from '@/schemas/admin/slot';
import { CalendarIcon, Sun, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface CreateSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: SlotRangeFormInput) => void;
}

const HOURS = Array.from({ length: 17 }, (_, idx) => idx + 6).map((hour) =>
  `${hour.toString().padStart(2, '0')}:00`
);

export function CreateSlotModal({
  isOpen,
  onClose,
  onGenerate,
}: CreateSlotModalProps) {
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

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
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
      weekdayStartTime: '09:00',
      weekdayEndTime: '18:00',
      weekendStartTime: '10:00',
      weekendEndTime: '17:00',
      makeAvailable: true,
    },
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const weekdayStartTime = watch('weekdayStartTime');
  const weekdayEndTime = watch('weekdayEndTime');
  const weekendStartTime = watch('weekendStartTime');
  const weekendEndTime = watch('weekendEndTime');
  const makeAvailable = watch('makeAvailable');

  useEffect(() => {
    register('startDate');
    register('endDate');
    register('weekdayStartTime');
    register('weekdayEndTime');
    register('weekendStartTime');
    register('weekendEndTime');
    register('makeAvailable');
  }, [register]);

  useEffect(() => {
    if (isOpen) {
      const today = format(new Date(), 'yyyy-MM-dd');
      reset({
        startDate: today,
        endDate: today,
        weekdayStartTime: '09:00',
        weekdayEndTime: '18:00',
        weekendStartTime: '10:00',
        weekendEndTime: '17:00',
        makeAvailable: true,
      });
    }
  }, [isOpen, reset]);

  const handleFormSubmit = (data: SlotRangeFormInput) => {
    onGenerate(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return 'Pick a date';
    try {
      return format(new Date(dateStr), 'MMM d, yyyy');
    } catch {
      return 'Pick a date';
    }
  };

  // Calculate days count
  const daysCount = (() => {
    if (!startDate || !endDate) return 0;
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    } catch {
      return 0;
    }
  })();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-lg rounded-xl sm:rounded-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="space-y-1 sm:space-y-2 flex-shrink-0">
          <DialogTitle className="text-sm sm:text-base lg:text-lg">Generate Slots</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Create time slots for multiple days with separate weekday and weekend hours.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="space-y-4 sm:space-y-5 py-2 sm:py-3 overflow-y-auto flex-1 pr-1">
            {/* Date Range Section */}
            <div className="space-y-3 p-3 sm:p-4 bg-muted/50 rounded-lg border-2 border-border">
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="h-4 w-4 text-primary" />
                <span className="text-xs sm:text-sm font-semibold">Date Range</span>
                {daysCount > 0 && (
                  <span className="ml-auto text-xs text-muted-foreground bg-primary/10 px-2 py-0.5 rounded-full">
                    {daysCount} day{daysCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Start Date */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Start Date</Label>
                  <Popover open={showStartCalendar} onOpenChange={setShowStartCalendar}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-9 sm:h-10 text-xs sm:text-sm border-2",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                        {formatDateDisplay(startDate)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate ? new Date(startDate) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            const formatted = format(date, 'yyyy-MM-dd');
                            setValue('startDate', formatted, { shouldValidate: true });
                            // If end date is before start date, update it
                            if (endDate && formatted > endDate) {
                              setValue('endDate', formatted, { shouldValidate: true });
                            }
                            setShowStartCalendar(false);
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.startDate && (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.startDate.message}</p>
                  )}
                </div>
                {/* End Date */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">End Date</Label>
                  <Popover open={showEndCalendar} onOpenChange={setShowEndCalendar}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-9 sm:h-10 text-xs sm:text-sm border-2",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                        {formatDateDisplay(endDate)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate ? new Date(endDate) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            setValue('endDate', format(date, 'yyyy-MM-dd'), { shouldValidate: true });
                            setShowEndCalendar(false);
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.endDate && (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.endDate.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Weekday Hours Section */}
            <div className="space-y-3 p-3 sm:p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs sm:text-sm font-semibold text-foreground">Weekday Hours</span>
                <span className="text-xs text-muted-foreground">(Mon-Fri)</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Start Time</Label>
                  <Select
                    value={weekdayStartTime || '09:00'}
                    onValueChange={(value) => setValue('weekdayStartTime', value, { shouldValidate: true })}
                  >
                    <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg">
                      <SelectValue placeholder="Start time" />
                    </SelectTrigger>
                    <SelectContent className="force-sheet-bg border-2 rounded-lg max-h-60">
                      {HOURS.map((hour) => (
                        <SelectItem key={hour} value={hour} className="text-xs sm:text-sm rounded-md">
                          {hour}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.weekdayStartTime && (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.weekdayStartTime.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">End Time</Label>
                  <Select
                    value={weekdayEndTime || '18:00'}
                    onValueChange={(value) => setValue('weekdayEndTime', value, { shouldValidate: true })}
                  >
                    <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg">
                      <SelectValue placeholder="End time" />
                    </SelectTrigger>
                    <SelectContent className="force-sheet-bg border-2 rounded-lg max-h-60">
                      {HOURS.filter((hour) => !weekdayStartTime || hour > weekdayStartTime).map((hour) => (
                        <SelectItem key={hour} value={hour} className="text-xs sm:text-sm rounded-md">
                          {hour}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.weekdayEndTime && (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.weekdayEndTime.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Weekend Hours Section */}
            <div className="space-y-3 p-3 sm:p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg border-2 border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-2">
                <Sun className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-xs sm:text-sm font-semibold text-foreground">Weekend Hours</span>
                <span className="text-xs text-muted-foreground">(Sat-Sun)</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Start Time</Label>
                  <Select
                    value={weekendStartTime || '10:00'}
                    onValueChange={(value) => setValue('weekendStartTime', value, { shouldValidate: true })}
                  >
                    <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg">
                      <SelectValue placeholder="Start time" />
                    </SelectTrigger>
                    <SelectContent className="force-sheet-bg border-2 rounded-lg max-h-60">
                      {HOURS.map((hour) => (
                        <SelectItem key={hour} value={hour} className="text-xs sm:text-sm rounded-md">
                          {hour}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.weekendStartTime && (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.weekendStartTime.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">End Time</Label>
                  <Select
                    value={weekendEndTime || '17:00'}
                    onValueChange={(value) => setValue('weekendEndTime', value, { shouldValidate: true })}
                  >
                    <SelectTrigger className="h-9 sm:h-10 text-xs sm:text-sm border-2 rounded-lg">
                      <SelectValue placeholder="End time" />
                    </SelectTrigger>
                    <SelectContent className="force-sheet-bg border-2 rounded-lg max-h-60">
                      {HOURS.filter((hour) => !weekendStartTime || hour > weekendStartTime).map((hour) => (
                        <SelectItem key={hour} value={hour} className="text-xs sm:text-sm rounded-md">
                          {hour}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.weekendEndTime && (
                    <p className="text-xs text-red-600 dark:text-red-400">{errors.weekendEndTime.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Make Available Checkbox */}
            <div className="flex items-center space-x-3 p-3 bg-green-50/50 dark:bg-green-950/20 rounded-lg border-2 border-green-200 dark:border-green-800">
              <Checkbox
                id="makeAvailable"
                checked={makeAvailable}
                onCheckedChange={(checked) => setValue('makeAvailable', !!checked)}
                className="border-green-400 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
              <div className="flex-1">
                <label
                  htmlFor="makeAvailable"
                  className="text-xs sm:text-sm font-medium leading-none cursor-pointer text-foreground"
                >
                  Make slots available immediately
                </label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Customers can book these slots right away
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 pt-2 sm:pt-3 flex-shrink-0 border-t border-border mt-2">
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
              {isSubmitting ? 'Generating...' : `Generate ${daysCount > 1 ? `(${daysCount} days)` : 'Slots'}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
