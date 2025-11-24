'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronRight, ArrowLeft } from 'lucide-react';
import { useCreateVehicle } from '@/api/domains/vehicles/queries';
import { mockVehicleBrands, mockVehicleModels } from '@/mocks/data/customer-mock-data';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addVehicleSchema, AddVehicleInput } from '@/schemas/customer/vehicle';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewStep = 'type' | 'category' | 'details';

const CAR_CATEGORIES = [
  { id: 'hatchback', name: 'Hatchback', icon: '🚗' },
  { id: 'sedan', name: 'Sedan', icon: '🚙' },
  { id: 'suv', name: 'SUV', icon: '🚐' },
];

const BIKE_CATEGORIES = [
  { id: 'scooter', name: 'Scooter', icon: '🛵' },
  { id: 'motorcycle', name: 'Motorcycle', icon: '🏍️' },
];

export function AddVehicleModal({ 
  isOpen, 
  onClose,
}: AddVehicleModalProps) {
  const createVehicleMutation = useCreateVehicle();
  const [currentStep, setCurrentStep] = useState<ViewStep>('type');
  const [selectedType, setSelectedType] = useState<'car' | 'bike' | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AddVehicleInput>({
    resolver: zodResolver(addVehicleSchema) as any,
    defaultValues: {
      category: 'car',
      bodyType: 'sedan',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      plateNumber: '',
      color: '',
      fuelType: 'petrol',
      isDefault: false,
    },
  });

  const formData = watch();

  const handleReset = () => {
    setCurrentStep('type');
    setSelectedType(null);
    setSelectedCategory(null);
    reset();
  };

  const handleBack = () => {
    if (currentStep === 'details') {
      setCurrentStep('category');
      setSelectedCategory(null);
    } else if (currentStep === 'category') {
      setCurrentStep('type');
      setSelectedType(null);
    }
  };

  const handleTypeSelect = (type: 'car' | 'bike') => {
    setSelectedType(type);
    setValue('category', type);
    setCurrentStep('category');
  };

  const handleCategorySelect = (bodyTypeId: string) => {
    setSelectedCategory(bodyTypeId);
    setValue('bodyType', bodyTypeId as 'sedan' | 'suv' | 'hatchback' | 'scooter' | 'motorcycle');
    // Reset brand when bodyType changes
    setValue('brand', '');
    setCurrentStep('details');
  };

  const onSubmit = (data: AddVehicleInput) => {
    createVehicleMutation.mutate(
      {
        category: data.category,
        bodyType: data.bodyType,
        brand: data.brand,
        model: data.model,
        year: data.year,
        plateNumber: data.plateNumber,
        color: data.color || undefined,
        fuelType: data.fuelType,
      },
      {
        onSuccess: () => {
          handleReset();
          onClose();
        },
      }
    );
  };

  // Get available brands based on selected category
  const availableBrands = selectedType === 'car' 
    ? mockVehicleBrands.filter(brand => {
        // Check if this brand has models for the selected category
        const brandModels = mockVehicleModels[brand.id] || [];
        return brandModels.some(model => model.type === selectedCategory);
      })
    : mockVehicleBrands; // For bikes, show all brands (you can add bike brands to mock data later)

  const categories = selectedType === 'car' ? CAR_CATEGORIES : BIKE_CATEGORIES;

  const getStepTitle = () => {
    if (currentStep === 'type') return 'Select Vehicle Type';
    if (currentStep === 'category') return `Select ${selectedType === 'car' ? 'Car' : 'Bike'} Category`;
    return 'Enter Vehicle Details';
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
                      <span className={currentStep === 'category' ? 'text-primary font-medium' : ''}>Category</span>
                    </>
                  )}
                  {currentStep === 'details' && (
                    <>
                      <ChevronRight className="h-3 w-3" />
                      <span className="text-primary font-medium">Details</span>
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

            {/* Step 2: Category */}
            {currentStep === 'category' && (
              <div className="space-y-2.5">
                {categories.map((category) => (
                  <Card
                    key={category.id}
                    className="cursor-pointer transition-all hover:shadow-sm hover:border-primary border-2 vehicle-card"
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
                            Select to continue
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-500 dark:text-muted-foreground flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Step 3: Vehicle Details Form */}
            {currentStep === 'details' && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Brand <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('brand')}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="">Select Brand</option>
                    {availableBrands.map((brand) => (
                      <option key={brand.id} value={brand.name}>{brand.name}</option>
                    ))}
                  </select>
                  {errors.brand && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">{String(errors.brand.message)}</p>
                  )}
                </div>

                {/* Model */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Model <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('model')}
                    placeholder="e.g., City, Swift, Classic 350"
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors"
                  />
                  {errors.model && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">{String(errors.model.message)}</p>
                  )}
                </div>

                {/* Plate Number */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Plate Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('plateNumber')}
                    placeholder="e.g., MH12AB1234"
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors font-mono uppercase"
                    onChange={(e) => {
                      e.target.value = e.target.value.toUpperCase();
                    }}
                  />
                  {errors.plateNumber && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">{String(errors.plateNumber.message)}</p>
                  )}
                </div>

                {/* Year and Color */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('year')}
                      placeholder="YYYY"
                      maxLength={4}
                      className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors"
                    />
                    {errors.year && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">{String(errors.year.message)}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Color <span className="text-xs text-muted-foreground">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      {...register('color')}
                      placeholder="e.g., White"
                      className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors"
                    />
                    {errors.color && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">{String(errors.color.message)}</p>
                    )}
                  </div>
                </div>

                {/* Fuel Type */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Fuel Type <span className="text-xs text-muted-foreground">(Optional)</span>
                  </label>
                  <select
                    {...register('fuelType')}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="cng">CNG</option>
                  </select>
                  {errors.fuelType && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">{String(errors.fuelType.message)}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleBack()}
                    className="flex-1"
                    disabled={createVehicleMutation.isPending}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={createVehicleMutation.isPending}
                  >
                    {createVehicleMutation.isPending ? 'Adding...' : 'Add Vehicle'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}