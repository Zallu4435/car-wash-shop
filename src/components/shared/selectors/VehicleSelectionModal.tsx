'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Car, Bike, Check, ChevronRight, ArrowLeft } from 'lucide-react';

interface Vehicle {
  id: string;
  type: 'car' | 'bike';
  category: string;
  brand: string;
  model: string;
  year: string;
  plateNumber?: string;
}

interface VehicleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (vehicle: Vehicle) => void;
  selectedVehicleId?: string;
}

const CAR_CATEGORIES = [
  { id: 'hatchback', name: 'Hatchback', icon: '🚗' },
  { id: 'sedan', name: 'Sedan', icon: '🚙' },
  { id: 'suv', name: 'SUV', icon: '🚐' },
];

const BIKE_CATEGORIES = [
  { id: 'scooter', name: 'Scooter', icon: '🛵' },
  { id: 'motorcycle', name: 'Motorcycle', icon: '🏍️' },
];

type ViewStep = 'type' | 'category' | 'vehicle';

export function VehicleSelectionModal({ 
  isOpen, 
  onClose, 
  onSelect,
  selectedVehicleId 
}: VehicleSelectionModalProps) {
  const [currentStep, setCurrentStep] = useState<ViewStep>('type');
  const [selectedType, setSelectedType] = useState<'car' | 'bike' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const mockVehicles: Vehicle[] = [
    { id: 'v1', type: 'car', category: 'hatchback', brand: 'Maruti', model: 'Swift', year: '2023', plateNumber: 'MH12AB1234' },
    { id: 'v2', type: 'car', category: 'hatchback', brand: 'Maruti', model: 'Baleno', year: '2022', plateNumber: 'MH14CD5678' },
    { id: 'v3', type: 'car', category: 'hatchback', brand: 'Hyundai', model: 'i20', year: '2023', plateNumber: 'MH12EF9012' },
    { id: 'v4', type: 'car', category: 'hatchback', brand: 'Tata', model: 'Tiago', year: '2021', plateNumber: 'MH14GH3456' },
    { id: 'v5', type: 'car', category: 'sedan', brand: 'Maruti', model: 'Dzire', year: '2023', plateNumber: 'MH12IJ7890' },
    { id: 'v6', type: 'car', category: 'sedan', brand: 'Honda', model: 'City', year: '2022', plateNumber: 'MH14KL1234' },
    { id: 'v7', type: 'car', category: 'sedan', brand: 'Hyundai', model: 'Verna', year: '2023', plateNumber: 'MH12MN5678' },
    { id: 'v8', type: 'car', category: 'sedan', brand: 'Maruti', model: 'Ciaz', year: '2021', plateNumber: 'MH14OP9012' },
    { id: 'v9', type: 'car', category: 'suv', brand: 'Tata', model: 'Nexon', year: '2023', plateNumber: 'MH12QR3456' },
    { id: 'v10', type: 'car', category: 'suv', brand: 'Hyundai', model: 'Creta', year: '2022', plateNumber: 'MH14ST7890' },
    { id: 'v11', type: 'car', category: 'suv', brand: 'Mahindra', model: 'XUV500', year: '2023', plateNumber: 'MH12UV1234' },
    { id: 'v12', type: 'car', category: 'suv', brand: 'Toyota', model: 'Fortuner', year: '2021', plateNumber: 'MH14WX5678' },
    { id: 'v13', type: 'bike', category: 'scooter', brand: 'Honda', model: 'Activa', year: '2023', plateNumber: 'MH12YZ9012' },
    { id: 'v14', type: 'bike', category: 'scooter', brand: 'TVS', model: 'Jupiter', year: '2022', plateNumber: 'MH14AB3456' },
    { id: 'v15', type: 'bike', category: 'scooter', brand: 'Suzuki', model: 'Access 125', year: '2023', plateNumber: 'MH12CD7890' },
    { id: 'v16', type: 'bike', category: 'scooter', brand: 'Yamaha', model: 'Fascino', year: '2021', plateNumber: 'MH14EF1234' },
    { id: 'v17', type: 'bike', category: 'motorcycle', brand: 'Hero', model: 'Splendor', year: '2023', plateNumber: 'MH12GH5678' },
    { id: 'v18', type: 'bike', category: 'motorcycle', brand: 'Bajaj', model: 'Pulsar 150', year: '2022', plateNumber: 'MH14IJ9012' },
    { id: 'v19', type: 'bike', category: 'motorcycle', brand: 'Royal Enfield', model: 'Classic 350', year: '2023', plateNumber: 'MH12KL3456' },
    { id: 'v20', type: 'bike', category: 'motorcycle', brand: 'KTM', model: 'Duke 200', year: '2021', plateNumber: 'MH14MN7890' },
  ];

  const handleReset = () => {
    setCurrentStep('type');
    setSelectedType(null);
    setSelectedCategory(null);
  };

  const handleBack = () => {
    if (currentStep === 'vehicle') {
      setCurrentStep('category');
      setSelectedCategory(null);
    } else if (currentStep === 'category') {
      setCurrentStep('type');
      setSelectedType(null);
    }
  };

  const handleTypeSelect = (type: 'car' | 'bike') => {
    setSelectedType(type);
    setCurrentStep('category');
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentStep('vehicle');
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    onSelect(vehicle);
    handleReset();
    onClose();
  };

  const filteredVehicles = mockVehicles.filter(
    v => v.type === selectedType && v.category === selectedCategory
  );

  const categories = selectedType === 'car' ? CAR_CATEGORIES : BIKE_CATEGORIES;

  const getStepTitle = () => {
    if (currentStep === 'type') return 'Select Vehicle Type';
    if (currentStep === 'category') return `${selectedType === 'car' ? 'Car' : 'Bike'} Category`;
    return `Select ${selectedCategory}`;
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
        <div className="bg-card border-2 border-border rounded-lg shadow-2xl max-h-[90vh] overflow-hidden flex flex-col mx-4">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0 bg-card">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {currentStep !== 'type' && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0 -ml-2"
                  onClick={handleBack}
                >
                  <ArrowLeft className="h-4 w-4" />
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
                      <span className={currentStep === 'category' ? 'text-primary font-medium' : ''}>Category</span>
                    </>
                  )}
                  {currentStep === 'vehicle' && (
                    <>
                      <ChevronRight className="h-3 w-3" />
                      <span className="text-primary font-medium capitalize truncate">{selectedCategory}</span>
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
            >
              <span className="sr-only">Close</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 bg-card">
            {/* Step 1: Vehicle Type */}
            {currentStep === 'type' && (
              <div className="grid grid-cols-2 gap-3">
                <Card
                  className="cursor-pointer transition-all hover:shadow-md hover:border-primary border-2"
                  onClick={() => handleTypeSelect('car')}
                >
                  <CardContent className="p-6 text-center flex flex-col items-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-3">
                      <Car className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1.5">Cars</h3>
                    <p className="text-[11px] text-muted-foreground mb-2.5 leading-tight">
                      Hatchback, Sedan, SUV
                    </p>
                    <Badge variant="secondary" className="text-xs font-medium">
                      {mockVehicles.filter(v => v.type === 'car').length}
                    </Badge>
                  </CardContent>
                </Card>

                <Card
                  className="cursor-pointer transition-all hover:shadow-md hover:border-primary border-2"
                  onClick={() => handleTypeSelect('bike')}
                >
                  <CardContent className="p-6 text-center flex flex-col items-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-3">
                      <Bike className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1.5">Bikes</h3>
                    <p className="text-[11px] text-muted-foreground mb-2.5 leading-tight">
                      Scooter, Motorcycle
                    </p>
                    <Badge variant="secondary" className="text-xs font-medium">
                      {mockVehicles.filter(v => v.type === 'bike').length}
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 2: Category */}
            {currentStep === 'category' && (
              <div className="space-y-2.5">
                {categories.map((category) => {
                  const vehicleCount = mockVehicles.filter(
                    v => v.type === selectedType && v.category === category.id
                  ).length;

                  return (
                    <Card
                      key={category.id}
                      className="cursor-pointer transition-all hover:shadow-sm hover:border-primary border-2"
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      <CardContent className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl flex-shrink-0">{category.icon}</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">{category.name}</h3>
                            <p className="text-[11px] text-muted-foreground">{vehicleCount} available</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground/60 flex-shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Step 3: Vehicle List */}
            {currentStep === 'vehicle' && (
              <div className="space-y-2.5">
                {filteredVehicles.length === 0 ? (
                  <div className="text-center py-12 bg-muted/20 rounded-lg border-2 border-dashed border-border">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-background rounded-full mb-3 border">
                      {selectedType === 'car' ? <Car className="h-6 w-6 text-muted-foreground" /> : <Bike className="h-6 w-6 text-muted-foreground" />}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      No {selectedCategory}s available
                    </p>
                  </div>
                ) : (
                  filteredVehicles.map((vehicle) => {
                    const isSelected = vehicle.id === selectedVehicleId;
                    const Icon = vehicle.type === 'car' ? Car : Bike;
                    
                    return (
                      <Card
                        key={vehicle.id}
                        className={`cursor-pointer transition-all border-2 ${
                          isSelected 
                            ? 'border-primary bg-primary/10 shadow-md' 
                            : 'border-border hover:border-primary hover:shadow-sm'
                        }`}
                        onClick={() => handleVehicleSelect(vehicle)}
                      >
                        <CardContent className="p-3.5">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-foreground truncate">
                                {vehicle.brand} {vehicle.model}
                              </p>
                              <p className="text-[11px] text-muted-foreground truncate">
                                {vehicle.plateNumber} • {vehicle.year}
                              </p>
                            </div>
                            {isSelected && (
                              <div className="h-7 w-7 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                <Check className="h-4 w-4 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
