'use client';

import { format, addDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
];

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
}

export function DateTimePicker({ selectedDate, selectedTime, onDateSelect, onTimeSelect }: DateTimePickerProps) {
  const days = getNext7Days();

  return (
    <div className="space-y-8">
      {/* Date Selection */}
      <div>
        <Label className="text-lg font-semibold mb-4 block text-foreground">Select Date</Label>
        <div className="grid grid-cols-3 sm:grid-cols-7 gap-3">
          {days.map((day) => {
            const isSelected = selectedDate && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
            const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            return (
              <Button
                key={day.toISOString()}
                variant={isSelected ? 'default' : 'outline'}
                className="flex flex-col h-auto py-4 relative"
                onClick={() => onDateSelect(day)}
              >
                {isToday && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-green-600 rounded-full"></span>
                )}
                <span className="text-xs font-medium">{format(day, 'EEE')}</span>
                <span className="text-2xl font-bold my-1">{format(day, 'd')}</span>
                <span className="text-xs">{format(day, 'MMM')}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div>
          <Label className="text-lg font-semibold mb-4 block text-foreground">Select Time</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {timeSlots.map((slot) => (
              <Button
                key={slot}
                variant={selectedTime === slot ? 'default' : 'outline'}
                className="h-12 font-semibold"
                onClick={() => onTimeSelect(slot)}
              >
                {slot}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
