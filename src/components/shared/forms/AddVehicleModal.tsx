'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useCreateVehicle } from '@/api/domains/vehicles/queries';
import { usePublicVehicleCategories, usePublicVehicleTypes } from '@/api/domains/public-vehicle-types/queries';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ViewStep = 'category' | 'type';

export function AddVehicleModal({
  isOpen,
  onClose,
}: AddVehicleModalProps) {
  const createVehicleMutation = useCreateVehicle();
  const { data: categories, isLoading: isLoadingCategories } = usePublicVehicleCategories();
  const [currentStep, setCurrentStep] = useState<ViewStep>('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get types for selected category
  const { data: types, isLoading: isLoadingTypes } = usePublicVehicleTypes(selectedCategory || undefined);

  const handleReset = () => {
    setCurrentStep('category');
    setSelectedCategory(null);
  };

  const handleBack = () => {
    if (currentStep === 'type') {
      setCurrentStep('category');
      setSelectedCategory(null);
    }
  };

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentStep('type');
  };

  const handleTypeSelect = (bodyType: string) => {
    if (!selectedCategory) return;

    createVehicleMutation.mutate(
      {
        category: selectedCategory,
        bodyType: bodyType as any,
      },
      {
        onSuccess: () => {
          handleReset();
          onClose();
        },
      }
    );
  };

  const getStepTitle = () => {
    if (currentStep === 'category') return 'Select Vehicle Category';
    const cat = categories?.find(c => c.slug === selectedCategory);
    return `Select ${cat?.name || ''} Type`;
  };

  if (!isOpen) return null;

  const isLoading = isLoadingCategories || (currentStep === 'type' && isLoadingTypes);

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
              {currentStep !== 'category' && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0 -ml-2"
                  onClick={handleBack}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <h2 className="text-base font-semibold text-foreground truncate">
                {getStepTitle()}
              </h2>
            </div>
            <button
              onClick={() => { handleReset(); onClose(); }}
              className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground flex-shrink-0"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* Step 1: Select Category */}
                {currentStep === 'category' && (
                  <div className="space-y-2.5">
                    {categories?.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No vehicle categories available
                      </p>
                    ) : (
                      categories?.map((category) => (
                        <Card
                          key={category._id}
                          className="cursor-pointer transition-all hover:shadow-sm hover:border-primary border-2 vehicle-card"
                          onClick={() => handleCategorySelect(category.slug)}
                        >
                          <CardContent className="p-3.5">
                            <div className="flex items-center gap-3">
                              <div className="text-3xl flex-shrink-0">{category.icon}</div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm truncate text-foreground">
                                  {category.name}
                                </h3>
                                <p className="text-[11px] text-muted-foreground">
                                  Tap to select
                                </p>
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-500 dark:text-muted-foreground flex-shrink-0" />
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                )}

                {/* Step 2: Select Type */}
                {currentStep === 'type' && (
                  <div className="space-y-2.5">
                    {types?.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No types available for this category
                      </p>
                    ) : (
                      types?.map((type) => (
                        <Card
                          key={type._id}
                          className={`cursor-pointer transition-all hover:shadow-sm hover:border-primary border-2 vehicle-card ${createVehicleMutation.isPending ? 'opacity-50 pointer-events-none' : ''}`}
                          onClick={() => handleTypeSelect(type.bodyType)}
                        >
                          <CardContent className="p-3.5">
                            <div className="flex items-center gap-3">
                              <div className="text-3xl flex-shrink-0">{type.icon || '•'}</div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm truncate text-foreground">
                                  {type.name}
                                </h3>
                                <p className="text-[11px] text-muted-foreground">
                                  Tap to add vehicle
                                </p>
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-500 dark:text-muted-foreground flex-shrink-0" />
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}

                    {createVehicleMutation.isPending && (
                      <p className="text-center text-sm text-muted-foreground mt-4">
                        Adding vehicle...
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}