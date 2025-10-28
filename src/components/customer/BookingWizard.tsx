'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Calendar } from 'lucide-react';

interface BookingWizardProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  children: React.ReactNode;
}

const steps = [
  'Service Type',
  'Service',
  'Vehicle/Address',
  'Schedule',
  'Add-ons',
  'Payment',
];

export function BookingWizard({ currentStep, totalSteps, onNext, onPrev, children }: BookingWizardProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Progress Header */}
      <Card className="border-2">
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <CardTitle className="text-lg sm:text-xl md:text-2xl">Book Your Service</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 sm:space-y-6">
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-2">
                <span className="font-medium text-foreground">Step {currentStep} of {totalSteps}</span>
                <span className="text-muted-foreground">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2 sm:h-3" />
            </div>
            
            {/* Steps Indicator - Responsive Layout */}
            <div className="flex justify-between gap-1 sm:gap-2">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center gap-1 sm:gap-2 flex-1">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all text-xs sm:text-base ${
                      index + 1 < currentStep
                        ? 'bg-green-600 dark:bg-green-600 text-white'
                        : index + 1 === currentStep
                        ? 'bg-primary text-primary-foreground ring-2 sm:ring-4 ring-primary/20'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index + 1 < currentStep ? (
                      <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <span className="font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <span className={`text-[9px] sm:text-xs text-center hidden sm:block leading-tight ${
                    index + 1 === currentStep ? 'font-semibold text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step}
                  </span>
                  {/* Mobile: Show only current step name */}
                  {index + 1 === currentStep && (
                    <span className="text-[9px] text-center sm:hidden font-semibold text-foreground leading-tight px-1">
                      {step}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card className="border-2">
        <CardContent className="p-4 sm:p-6 md:p-8">
          {children}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-2 sm:gap-3">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={currentStep === 1}
          size="lg"
          className="w-full sm:w-auto h-11 sm:h-12 text-sm sm:text-base"
        >
          Previous
        </Button>
        <Button 
          onClick={onNext}
          size="lg"
          className="w-full sm:w-auto shadow-lg h-11 sm:h-12 text-sm sm:text-base"
        >
          {currentStep === totalSteps ? 'Complete Booking' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
