// DynamicAddOnSelector.tsx
'use client';

import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { AddOn } from '@/lib/api/bookingApi';

interface DynamicAddOnSelectorProps {
  addOns: AddOn[];
  selectedAddOns: string[];
  onToggle: (addOnId: string) => void;
}

export function DynamicAddOnSelector({
  addOns,
  selectedAddOns,
  onToggle,
}: DynamicAddOnSelectorProps) {
  if (addOns.length === 0) {
    return (
      <div className="text-center py-10 sm:py-12 border-2 border-dashed border-border rounded-lg">
        <p className="text-sm sm:text-base text-muted-foreground px-4">
          No add-ons available for this service type
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {addOns.map((addOn) => (
        <Card
          key={addOn.id}
          className={`cursor-pointer transition-all border-2 hover:shadow-lg ${
            selectedAddOns.includes(addOn.id)
              ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
              : 'border-border'
          }`}
          onClick={() => onToggle(addOn.id)}
        >
          <div className="p-3 sm:p-4 flex items-start gap-3 sm:gap-4">
            <Checkbox
              id={addOn.id}
              checked={selectedAddOns.includes(addOn.id)}
              onCheckedChange={() => onToggle(addOn.id)}
              className="mt-0.5 sm:mt-1 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <Label
                htmlFor={addOn.id}
                className="cursor-pointer font-semibold text-foreground text-sm sm:text-base block mb-0.5 sm:mb-1"
              >
                {addOn.name}
              </Label>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {addOn.description}
              </p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              <span className="font-bold text-primary text-sm sm:text-base md:text-lg whitespace-nowrap">
                ₹{addOn.price}
              </span>
            </div>
          </div>
        </Card>
      ))}

      <div className="text-center pt-3 sm:pt-4 border-t border-border">
        <p className="text-xs sm:text-sm text-muted-foreground px-4">
          {selectedAddOns.length === 0
            ? 'No add-ons selected. You can skip this step or choose extras above.'
            : `${selectedAddOns.length} add-on${selectedAddOns.length !== 1 ? 's' : ''} selected`}
        </p>
      </div>
    </div>
  );
}
