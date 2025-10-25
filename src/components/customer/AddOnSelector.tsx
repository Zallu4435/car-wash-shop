'use client';

import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface AddOnSelectorProps {
  addOns: AddOn[];
  selectedAddOns: string[];
  onToggle: (addOnId: string) => void;
}

export function AddOnSelector({ addOns, selectedAddOns, onToggle }: AddOnSelectorProps) {
  return (
    <div className="space-y-4">
      {addOns.map((addOn) => (
        <Card
          key={addOn.id}
          className={`cursor-pointer transition-all border-2 hover:shadow-lg ${
            selectedAddOns.includes(addOn.id) ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : ''
          }`}
          onClick={() => onToggle(addOn.id)}
        >
          <div className="p-4 flex items-start gap-4">
            <Checkbox
              id={addOn.id}
              checked={selectedAddOns.includes(addOn.id)}
              onCheckedChange={() => onToggle(addOn.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor={addOn.id} className="cursor-pointer font-semibold text-foreground text-base">
                {addOn.name}
              </Label>
              <p className="text-sm text-muted-foreground mt-1">{addOn.description}</p>
            </div>
            <div className="flex items-center gap-1">
              <Plus className="h-4 w-4 text-primary" />
              <span className="font-bold text-primary text-lg">₹{addOn.price}</span>
            </div>
          </div>
        </Card>
      ))}
      
      {selectedAddOns.length === 0 && (
        <p className="text-center text-muted-foreground py-4">
          No add-ons selected. You can skip this step or choose extras above.
        </p>
      )}
    </div>
  );
}
