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
  'Select Service',
  'Choose Vehicle',
  'Schedule',
  'Add-ons',
  'Payment',
];

export function BookingWizard({ currentStep, totalSteps, onNext, onPrev, children }: BookingWizardProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Book Your Service</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-foreground">Step {currentStep} of {totalSteps}</span>
                <span className="text-muted-foreground">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
            
            {/* Steps Indicator */}
            <div className="flex justify-between gap-2">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      index + 1 < currentStep
                        ? 'bg-green-600 dark:bg-green-600 text-white'
                        : index + 1 === currentStep
                        ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index + 1 < currentStep ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <span className={`text-xs text-center hidden sm:block ${
                    index + 1 === currentStep ? 'font-semibold text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card className="border-2">
        <CardContent className="p-6 md:p-8">
          {children}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={currentStep === 1}
          size="lg"
          className="sm:w-auto w-full"
        >
          Previous
        </Button>
        <Button 
          onClick={onNext}
          size="lg"
          className="sm:w-auto w-full shadow-lg"
        >
          {currentStep === totalSteps ? 'Complete Booking' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
