'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';

interface CalendarProps {
  mode?: 'single';
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
}

export function Calendar({ mode = 'single', selected, onSelect, className }: CalendarProps) {
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

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              className={cn(
                'aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all',
                'hover:bg-primary/10 hover:scale-105',
                isSelectedDay && 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg scale-105',
                isTodayDay && !isSelectedDay && 'bg-primary/20 font-bold ring-2 ring-primary',
                !isSelectedDay && !isTodayDay && 'text-foreground hover:text-primary'
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
