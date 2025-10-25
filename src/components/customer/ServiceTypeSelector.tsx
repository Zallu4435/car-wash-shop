'use client';

import { Car, Bike, Home } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ServiceType } from '@/lib/api/bookingApi';

const iconMap = {
  Car,
  Bike,
  Home,
};

interface ServiceTypeSelectorProps {
  serviceTypes: ServiceType[];
  selectedType: string;
  onTypeSelect: (type: string) => void;
}

export function ServiceTypeSelector({ serviceTypes, selectedType, onTypeSelect }: ServiceTypeSelectorProps) {
  return (
    <RadioGroup value={selectedType} onValueChange={onTypeSelect}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {serviceTypes.map((type) => {
          const Icon = iconMap[type.icon as keyof typeof iconMap] || Car;
          return (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all border-2 hover:shadow-lg ${
                selectedType === type.id
                  ? 'ring-2 ring-primary border-primary bg-primary/5'
                  : 'border-border'
              }`}
              onClick={() => onTypeSelect(type.id)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <RadioGroupItem value={type.id} id={type.id} className="sr-only" />
                  <Label htmlFor={type.id} className="cursor-pointer w-full">
                    <div
                      className={`p-4 rounded-xl mx-auto mb-3 w-fit ${
                        selectedType === type.id ? 'bg-primary/10' : 'bg-muted'
                      }`}
                    >
                      <Icon
                        className={`h-8 w-8 ${
                          selectedType === type.id
                            ? 'text-primary'
                            : 'text-muted-foreground'
                        }`}
                      />
                    </div>
                    <h3 className="font-bold text-lg text-foreground mb-1">{type.name}</h3>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </Label>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </RadioGroup>
  );
}
