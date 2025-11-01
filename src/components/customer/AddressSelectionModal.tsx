'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, Check, Home, Briefcase, MapPinned, X } from 'lucide-react';
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
  const [mounted, setMounted] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Handle mounting for animation
  useEffect(() => {
    if (open) {
      setMounted(true);
      // Small delay to trigger animation
      setTimeout(() => {
        setShowContent(true);
      }, 10);
    } else {
      setShowContent(false);
    }
  }, [open]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [open]);

  // Handle unmounting after animation
  const handleTransitionEnd = () => {
    if (!open) {
      setMounted(false);
    }
  };

  const handleSelectAddress = (addressId: string) => {
    onSelectAddress(addressId);
    onOpenChange(false);
  };

  const handleAddressAdded = () => {
    onAddressAdded();
    setShowAddAddressDialog(false);
  };

  if (!mounted && !open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-md transition-opacity duration-500 ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <div 
        className={`fixed left-1/2 top-1/2 z-50 w-full max-w-2xl transition-all duration-500 ease-in-out ${
          showContent 
            ? '-translate-x-1/2 -translate-y-1/2 opacity-100 scale-100' 
            : '-translate-x-1/2 -translate-y-1/2 opacity-0 scale-95'
        }`}
        onTransitionEnd={handleTransitionEnd}
      >
        <div className="border-2 border-border rounded-lg sm:rounded-xl lg:rounded-2xl shadow-2xl max-h-[92vh] sm:max-h-[90vh] overflow-hidden flex flex-col mx-4 force-sheet-bg">
          {/* Header */}
          <div className="flex-shrink-0 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                <div>
                  <h2 className="text-sm sm:text-base lg:text-lg font-bold text-foreground">Select Delivery Address</h2>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground mt-0.5">
                    Choose where you want your order delivered
                  </p>
                </div>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 hover:bg-muted rounded-xl transition-colors cursor-pointer flex-shrink-0"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5 lg:py-6">
            <div className="space-y-3 sm:space-y-4">
              {/* Add New Address Button */}
              <Card
                className="border-2 border-dashed border-primary/30 hover:border-primary/60 cursor-pointer transition-all hover:shadow-md bg-primary/5"
                onClick={() => setShowAddAddressDialog(true)}
              >
                <CardContent className="p-3 sm:p-4 lg:p-5">
                  <div className="flex items-center gap-3">
                    <Plus className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm sm:text-base text-foreground">Add New Address</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Add a new delivery location
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Saved Addresses */}
              {addresses.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="p-4 bg-muted rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                    <MapPin className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-foreground mb-1">No saved addresses</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
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
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <LabelIcon
                            className={`h-5 w-5 flex-shrink-0 ${
                              isSelected ? 'text-primary' : 'text-muted-foreground'
                            }`}
                          />

                          {/* Address Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-sm sm:text-base text-foreground capitalize">
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
                              <p className="text-xs text-muted-foreground mt-1.5">
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
        </div>
      </div>

      {/* Add Address Dialog */}
      <AddAddressDialog
        open={showAddAddressDialog}
        onOpenChange={setShowAddAddressDialog}
        onAddressAdded={handleAddressAdded}
      />
    </>
  );
}
