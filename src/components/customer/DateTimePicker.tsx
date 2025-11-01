'use client';

import { format, addDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAvailableSlots } from '@/api/domains/bookings/queries';
import { Clock } from 'lucide-react';
import Loading from '@/components/shared/display/Loading';
import { EmptyState } from '@/components/shared/display/EmptyState';

// Helper function to format 24-hour time to 12-hour format for display
const formatTimeDisplay = (time24: string): string => {
  if (!time24 || typeof time24 !== 'string') return time24;
  
  // If already in 12-hour format (contains AM/PM), return as is
  if (time24.includes('AM') || time24.includes('PM')) {
    return time24;
  }
  
  const parts = time24.split(':');
  if (parts.length !== 2) return time24;
  
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  
  if (isNaN(hours) || isNaN(minutes)) return time24;
  
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const getNext7Days = () => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(addDays(new Date(), i));
  }
  return days;
};

interface DateTimePickerProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  serviceId?: string;
}

export function DateTimePicker({ selectedDate, selectedTime, onDateSelect, onTimeSelect, serviceId }: DateTimePickerProps) {
  const days = getNext7Days();
  
  // Fetch available slots when date and service are selected
  const dateString = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const { data: slotsData, isLoading: slotsLoading } = useAvailableSlots(
    serviceId || '',
    dateString
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Date Selection */}
      <div>
        <Label className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 block text-foreground">
          Select Date
        </Label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 sm:gap-3">
          {days.map((day) => {
            const isSelected = selectedDate && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            return (
              <Button
                key={day.toISOString()}
                variant={isSelected ? 'default' : 'outline'}
                className={`flex flex-col h-auto py-3 sm:py-4 relative transition-all ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-100 border-2 border-blue-500 dark:border-blue-600 shadow-md ring-1 ring-blue-200 dark:ring-blue-800'
                    : 'border-2 hover:shadow-md hover:scale-105'
                }`}
                onClick={() => onDateSelect(day)}
              >
                {isToday && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                )}
                {isSelected && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500">
                      <span className="text-[8px] text-white leading-none">✓</span>
                    </span>
                  </span>
                )}
                <span className={`text-[10px] sm:text-xs font-medium uppercase ${isSelected ? 'text-white' : ''}`}>
                  {format(day, 'EEE')}
                </span>
                <span className={`text-xl sm:text-2xl font-bold my-0.5 sm:my-1 ${isSelected ? 'text-white' : ''}`}>
                  {format(day, 'd')}
                </span>
                <span className={`text-[10px] sm:text-xs ${isSelected ? 'text-blue-100' : 'text-muted-foreground'}`}>
                  {format(day, 'MMM')}
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <Label className="text-base sm:text-lg font-semibold text-foreground">
              Select Time
            </Label>
            
            {/* Legend */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-emerald-600 dark:bg-emerald-500 border border-emerald-700"></div>
                <span className="text-muted-foreground">Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-red-600 dark:bg-red-600 border border-red-700"></div>
                <span className="text-muted-foreground">Booked</span>
              </div>
            </div>
          </div>
          
          {slotsLoading ? (
            <div className="py-4">
              <Loading text="Loading available slots..." size="sm" />
            </div>
          ) : slotsData?.slots && slotsData.slots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
              {slotsData.slots.map((slot) => {
                const isSelected = selectedTime === slot.startTime;
                const isAvailable = slot.isAvailable;
                
                return (
                  <Button
                    key={slot.startTime}
                    variant={isSelected ? 'default' : 'outline'}
                    disabled={!isAvailable}
                    className={`h-10 sm:h-12 font-semibold text-xs sm:text-sm transition-all relative ${
                      isSelected
                        ? 'bg-blue-500 dark:bg-blue-600 text-white border-2 border-blue-500 dark:border-blue-600 shadow-md ring-1 ring-blue-200 dark:ring-blue-800'
                        : isAvailable
                        ? 'bg-emerald-100 dark:bg-emerald-950/30 border-[3px] border-emerald-600 dark:border-emerald-500 text-emerald-950 dark:text-emerald-200 hover:bg-emerald-200 dark:hover:bg-emerald-900/40 hover:shadow-md hover:scale-105'
                        : 'bg-red-200 dark:bg-red-950/40 border-[4px] border-red-700 dark:border-red-600 text-red-950 dark:text-red-200 cursor-not-allowed opacity-80 font-bold'
                    }`}
                    onClick={() => isAvailable && onTimeSelect(slot.startTime)}
                  >
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500">
                          <span className="text-[8px] text-white leading-none">✓</span>
                        </span>
                      </span>
                    )}
                    {formatTimeDisplay(slot.startTime)}
                    {!isAvailable && (
                      <span className="ml-1 text-[10px]">✕</span>
                    )}
                  </Button>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Clock}
              title="No available slots"
              description="All time slots are booked for this date. Please select a different date."
            />
          )}
        </div>
      )}
    </div>
  );
}