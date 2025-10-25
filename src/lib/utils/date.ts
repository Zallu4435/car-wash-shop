export const getAvailableDates = (daysAhead: number = 7): Date[] => {
  const dates: Date[] = [];
  const today = new Date();
  
  for (let i = 1; i <= daysAhead; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  
  return dates;
};

export const getAvailableTimeSlots = (): string[] => {
  return [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM'
  ];
};

export const isTimeSlotAvailable = (
  date: string,
  time: string,
  bookedSlots: { date: string; time: string }[]
): boolean => {
  return !bookedSlots.some(slot => slot.date === date && slot.time === time);
};

export const formatDateForDisplay = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-IN', options);
};
