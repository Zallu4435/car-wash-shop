'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useCreateVehicle } from '@/api/domains/vehicles/queries';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewStep = 'type' | 'category';

const CAR_CATEGORIES = [
  { id: 'hatchback', name: 'Hatchback', icon: '🚗' },
  { id: 'sedan', name: 'Sedan', icon: '🚙' },
  { id: 'suv', name: 'SUV', icon: '🚐' },
];

const BIKE_CATEGORIES = [
  { id: 'super-bike', name: 'Super Bike', icon: '🏍️' },
  { id: 'sports-bike', name: 'Sports Bike', icon: '🏁' },
  { id: 'cruiser', name: 'Cruiser', icon: '🛵' },
  { id: 'scooty', name: 'Scooty', icon: '🛴' },
];

export function AddVehicleModal({
  isOpen,
  onClose,
}: AddVehicleModalProps) {
  const createVehicleMutation = useCreateVehicle();
  const [currentStep, setCurrentStep] = useState<ViewStep>('type');
  const [selectedType, setSelectedType] = useState<'car' | 'bike' | null>(null);

  const handleReset = () => {
    setCurrentStep('type');
    setSelectedType(null);
  };

  const handleBack = () => {
    if (currentStep === 'category') {
      setCurrentStep('type');
      setSelectedType(null);
    }
  };

  const handleTypeSelect = (type: 'car' | 'bike') => {
    setSelectedType(type);
    setCurrentStep('category');
  };

  const handleCategorySelect = (bodyTypeId: string) => {
    if (!selectedType) return;

    // Create vehicle immediately when category is selected
    createVehicleMutation.mutate(
      {
        category: selectedType,
        bodyType: bodyTypeId as any,
      },
      {
        onSuccess: () => {
          handleReset();
          onClose();
        },
      }
    );
  };

  const categories = selectedType === 'car' ? CAR_CATEGORIES : BIKE_CATEGORIES;

  const getStepTitle = () => {
    if (currentStep === 'type') return 'Select Vehicle Type';
    return `Select ${selectedType === 'car' ? 'Car' : 'Bike'} Category`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Custom Backdrop with Blur */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md dark:bg-black/70"
        onClick={() => { handleReset(); onClose(); }}
      />

      {/* Modal Dialog */}
      <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
        <div className="border-2 border-border rounded-lg shadow-2xl max-h-[90vh] overflow-hidden flex flex-col mx-4 vehicle-modal-bg">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0 vehicle-modal-bg">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {currentStep !== 'type' && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0 -ml-2"
                  onClick={handleBack}
                  disabled={createVehicleMutation.isPending}
                >
                  <ArrowLeft className="h-4 w-4 text-gray-700 dark:text-foreground" />
                </Button>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-foreground truncate">
                  {getStepTitle()}
                </h2>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                  <span className={currentStep === 'type' ? 'text-primary font-medium' : ''}>Type</span>
                  {currentStep !== 'type' && (
                    <>
                      <ChevronRight className="h-3 w-3" />
                      <span className="text-primary font-medium">Category</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
              onClick={() => { handleReset(); onClose(); }}
              disabled={createVehicleMutation.isPending}
            >
              <span className="sr-only">Close</span>
              <svg className="h-4 w-4 text-gray-700 dark:text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 vehicle-modal-bg">
            {/* Step 1: Vehicle Type */}
            {currentStep === 'type' && (
              <div className="grid grid-cols-2 gap-3">
                <Card
                  className="cursor-pointer transition-all hover:shadow-md hover:border-primary border-2 vehicle-card"
                  onClick={() => handleTypeSelect('car')}
                >
                  <CardContent className="p-6 text-center flex flex-col items-center">
                    <div className="text-5xl mb-3">🚗</div>
                    <h3 className="font-semibold text-sm mb-1.5 text-foreground">Cars</h3>
                    <p className="text-[11px] text-muted-foreground mb-2.5 leading-tight">
                      Hatchback, Sedan, SUV
                    </p>
                    <Badge variant="secondary" className="text-xs font-medium">
                      Popular
                    </Badge>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer transition-all hover:shadow-md hover:border-primary border-2 vehicle-card"
                  onClick={() => handleTypeSelect('bike')}
                >
                  <CardContent className="p-6 text-center flex flex-col items-center">
                    <div className="text-5xl mb-3">🏍️</div>
                    <h3 className="font-semibold text-sm mb-1.5 text-foreground">Bikes</h3>
                    <p className="text-[11px] text-muted-foreground mb-2.5 leading-tight">
                      Scooter, Motorcycle
                    </p>
                    <Badge variant="secondary" className="text-xs font-medium">
                      Popular
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 2: Category - Auto-submits on selection */}
            {currentStep === 'category' && (
              <div className="space-y-2.5">
                {categories.map((category) => (
                  <Card
                    key={category.id}
                    className={`cursor-pointer transition-all hover:shadow-sm hover:border-primary border-2 vehicle-card ${createVehicleMutation.isPending ? 'opacity-50 pointer-events-none' : ''}`}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <CardContent className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl flex-shrink-0">{category.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate text-foreground">
                            {category.name}
                          </h3>
                          <p className="text-[11px] text-muted-foreground">
                            Tap to add vehicle
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-500 dark:text-muted-foreground flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {createVehicleMutation.isPending && (
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    Adding vehicle...
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}