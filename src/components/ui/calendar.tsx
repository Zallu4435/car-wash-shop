'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';

interface CalendarProps {
  mode?: 'single';
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
  availableDays?: string[]; // Array of date strings in 'YYYY-MM-DD' format. If undefined, all dates are allowed. If empty array, no dates are allowed.
  disabled?: boolean;
}

export function Calendar({ 
  mode = 'single', 
  selected, 
  onSelect, 
  className,
  availableDays,
  disabled = false
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(selected || new Date());

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    onSelect?.(newDate);
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    return (
      selected.getDate() === day &&
      selected.getMonth() === currentMonth.getMonth() &&
      selected.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isAvailable = (day: number) => {
    // If availableDays is undefined, allow all dates (for admin use)
    if (availableDays === undefined) return true;
    // If availableDays is an empty array, disable all dates (no slots available)
    if (availableDays.length === 0) return false;
    // Otherwise, check if the date is in the availableDays array
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    // Use format() instead of toISOString() to avoid timezone issues
    const dateKey = format(date, 'yyyy-MM-dd');
    return availableDays.includes(dateKey);
  };

  const isPastDate = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className={cn('p-4 bg-card rounded-xl', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={previousMonth}
          className="hover:bg-primary/10"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">
            {currentMonth.toLocaleString('default', { month: 'long' })}
          </h2>
          <p className="text-sm text-muted-foreground">
            {currentMonth.getFullYear()}
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={nextMonth}
          className="hover:bg-primary/10"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div 
            key={day} 
            className="text-center text-xs font-semibold text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {/* Days of the month */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const isSelectedDay = isSelected(day);
          const isTodayDay = isToday(day);
          const dayAvailable = isAvailable(day);
          const dayPast = isPastDate(day);
          const isDisabled = disabled || !dayAvailable || dayPast;

          return (
            <button
              key={day}
              onClick={() => !isDisabled && handleDateClick(day)}
              disabled={isDisabled}
              className={cn(
                'aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all',
                isDisabled && 'opacity-40 cursor-not-allowed',
                !isDisabled && 'hover:bg-primary/10 hover:scale-105',
                isSelectedDay &&
                  'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/80 shadow-xl scale-110 ring-2 ring-primary/70',
                isTodayDay && !isSelectedDay && !isDisabled && 'bg-primary/20 font-bold ring-2 ring-primary',
                !isSelectedDay && !isTodayDay && !isDisabled && 'text-foreground hover:text-primary',
                dayAvailable && !isSelectedDay && !isTodayDay && !dayPast && 'bg-green-50 dark:bg-green-950/20'
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
