'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Check, Home, Briefcase, MapPinned } from 'lucide-react';
import { AddAddressDialog } from '@/components/shared/dialogs/AddAddressDialog';
import type { Address } from '@/types/address';

interface AddressSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addresses: Address[];
  selectedAddressId: string;
  onSelectAddress: (addressId: string) => void;
  onAddressAdded: () => void;
}

const getLabelIcon = (label: string) => {
  switch (label.toLowerCase()) {
    case 'home':
      return Home;
    case 'work':
      return Briefcase;
    default:
      return MapPinned;
  }
};

export function AddressSelectionModal({
  open,
  onOpenChange,
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddressAdded,
}: AddressSelectionModalProps) {
  const [showAddAddressDialog, setShowAddAddressDialog] = useState(false);

  const handleSelectAddress = (addressId: string) => {
    onSelectAddress(addressId);
    onOpenChange(false);
  };

  const handleAddressAdded = () => {
    onAddressAdded();
    setShowAddAddressDialog(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <DialogTitle className="text-lg sm:text-xl">Select Delivery Address</DialogTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Choose where you want your order delivered
            </p>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-2 -mr-2">
            <div className="space-y-3 py-4">
              {/* Add New Address Button */}
              <Card
                className="border-2 border-dashed border-primary/30 hover:border-primary/60 cursor-pointer transition-all hover:shadow-md bg-primary/5"
                onClick={() => setShowAddAddressDialog(true)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Plus className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Add New Address</p>
                      <p className="text-sm text-muted-foreground">
                        Add a new delivery location
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Saved Addresses */}
              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <div className="p-4 bg-muted rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">No saved addresses</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Click "Add New Address" to get started
                  </p>
                </div>
              ) : (
                addresses.map((address) => {
                  const isSelected = address.id === selectedAddressId;
                  const LabelIcon = getLabelIcon(address.label);

                  return (
                    <Card
                      key={address.id}
                      className={`cursor-pointer transition-all border-2 hover:shadow-md ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleSelectAddress(address.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div
                            className={`p-2 rounded-lg flex-shrink-0 ${
                              isSelected ? 'bg-primary/20' : 'bg-muted'
                            }`}
                          >
                            <LabelIcon
                              className={`h-5 w-5 ${
                                isSelected ? 'text-primary' : 'text-muted-foreground'
                              }`}
                            />
                          </div>

                          {/* Address Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-foreground capitalize">
                                  {address.label}
                                </p>
                                {address.isPrimary && (
                                  <Badge variant="secondary" className="text-xs">
                                    Default
                                  </Badge>
                                )}
                              </div>
                              {isSelected && (
                                <div className="p-1 bg-primary rounded-full flex-shrink-0">
                                  <Check className="h-4 w-4 text-white" />
                                </div>
                              )}
                            </div>

                            <p className="text-sm text-foreground leading-relaxed mb-1">
                              {address.line1}
                              {address.line2 && `, ${address.line2}`}
                            </p>

                            <p className="text-sm text-muted-foreground">
                              {address.city}, {address.state} - {address.pincode}
                            </p>

                            {address.landmark && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Landmark: {address.landmark}
                              </p>
                            )}

                            {address.phone && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Phone: {address.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Address Dialog */}
      <AddAddressDialog
        open={showAddAddressDialog}
        onOpenChange={setShowAddAddressDialog}
        onAddressAdded={handleAddressAdded}
      />
    </>
  );
}
