// components/customer/AddressSelector.tsx
'use client';

import { useState } from 'react';
import { Plus, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AddAddressDialog } from '@/components/shared/dialogs/AddAddressDialog';
import type { Address } from '@/types/address';

interface AddressSelectorProps {
  addresses: Address[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAddressAdded: () => void;
}

export function AddressSelector({
  addresses,
  selectedId,
  onSelect,
  onAddressAdded,
}: AddressSelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground">
          Select Service Address
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs sm:text-sm h-9 sm:h-10 w-full sm:w-auto"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-10 sm:py-12 border-2 border-dashed border-border rounded-lg">
          <MapPin className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-2 sm:mb-3" />
          <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 px-4">
            No addresses added yet
          </p>
          <Button onClick={() => setIsDialogOpen(true)} className="h-10 sm:h-11 text-sm sm:text-base">
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        </div>
      ) : (
        <RadioGroup value={selectedId} onValueChange={onSelect}>
          <div className="grid gap-3 sm:gap-4">
            {addresses.map((address) => (
              <Card
                key={address.id}
                className={`cursor-pointer transition-all border-2 hover:shadow-lg ${
                  selectedId === address.id
                    ? 'ring-2 ring-primary border-primary bg-primary/5'
                    : 'border-border'
                }`}
                onClick={() => onSelect(address.id)}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <RadioGroupItem
                      value={address.id}
                      id={address.id}
                      className="mt-1 flex-shrink-0"
                    />
                    <Label htmlFor={address.id} className="flex-1 cursor-pointer min-w-0">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div
                          className={`p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0 ${
                            selectedId === address.id ? 'bg-primary/10' : 'bg-muted'
                          }`}
                        >
                          <MapPin
                            className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${
                              selectedId === address.id ? 'text-primary' : 'text-muted-foreground'
                            }`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-foreground text-xs sm:text-sm md:text-base mb-0.5 sm:mb-1 capitalize">
                            {address.label}
                          </p>
                          <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground break-words leading-relaxed">
                            {address.line1}{address.line2 ? ', ' + address.line2 : ''}, {address.city}, {address.state} - {address.pincode}
                          </p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </RadioGroup>
      )}

      <AddAddressDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddressAdded={onAddressAdded}
      />
    </div>
  );
}
