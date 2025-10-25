import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface BookingDraft {
  serviceId?: string;
  vehicleId?: string;
  date?: string;
  time?: string;
  address?: string;
  addOns?: string[];
}

export function useBooking() {
  const [draft, setDraft, clearDraft] = useLocalStorage<BookingDraft>('booking_draft', {});
  const [currentStep, setCurrentStep] = useState(1);

  const updateBooking = (data: Partial<BookingDraft>) => {
    setDraft({ ...draft, ...data });
  };

  const resetBooking = () => {
    clearDraft();
    setCurrentStep(1);
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => Math.max(1, prev - 1));

  return {
    booking: draft,
    currentStep,
    updateBooking,
    resetBooking,
    nextStep,
    prevStep,
  };
}
