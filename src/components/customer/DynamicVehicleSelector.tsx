'use client';

import { useState } from 'react';
import { Car, Bike, Plus, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import type { Vehicle } from '@/types/vehicle';
import type { Address } from '@/types/address';
import { VehicleSelectionModal } from '@/components/shared/selectors/VehicleSelectionModal';

interface DynamicVehicleSelectorProps {
  serviceType: string;
  vehicles: Vehicle[];
  addresses: Address[];
  selectedId: string;
  onSelect: (id: string) => void;
  onVehicleAdded: () => void;
}

export function DynamicVehicleSelector({
  serviceType,
  vehicles,
  addresses,
  selectedId,
  onSelect,
  onVehicleAdded,
}: DynamicVehicleSelectorProps) {
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addressLabel, setAddressLabel] = useState('');
  const [addressText, setAddressText] = useState('');

  const Icon = serviceType === 'car' ? Car : serviceType === 'bike' ? Bike : MapPin;
  const isHomeService = serviceType === 'home';

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.info('Please use the Add Address button in the address selection');
    setIsAddressDialogOpen(false);
  };

  const handleVehicleSelect = async (vehicle: any) => {
    toast.info('Please use the vehicle management page to add vehicles');
    setIsVehicleModalOpen(false);
  };

  const items = isHomeService ? addresses : vehicles;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground">
          {isHomeService
            ? 'Select Address'
            : `Select Your ${serviceType === 'car' ? 'Vehicle' : 'Bike'}`}
        </h3>
        
        {/* Address Dialog for Home Service */}
        {isHomeService ? (
          <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm h-9 sm:h-10 w-full sm:w-auto">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Add Address
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-4 sm:mx-auto">
              <DialogHeader>
                <DialogTitle className="text-base sm:text-lg">Add New Address</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddAddress} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="label" className="text-xs sm:text-sm">Label *</Label>
                  <Select value={addressLabel} onValueChange={setAddressLabel}>
                    <SelectTrigger id="label" className="h-10 sm:h-11">
                      <SelectValue placeholder="Select label" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-xs sm:text-sm">Complete Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter full address with landmarks"
                    rows={4}
                    value={addressText}
                    onChange={(e) => setAddressText(e.target.value)}
                    className="text-xs sm:text-sm"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-11 sm:h-12 text-sm sm:text-base" 
                  size="lg" 
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Address'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        ) : (
          /* Vehicle Modal for Car/Bike Service */
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs sm:text-sm h-9 sm:h-10 w-full sm:w-auto"
            onClick={() => setIsVehicleModalOpen(true)}
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Add {serviceType === 'car' ? 'Vehicle' : 'Bike'}
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-10 sm:py-12 border-2 border-dashed border-border rounded-lg">
          <Icon className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-2 sm:mb-3" />
          <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 px-4">
            No {isHomeService ? 'addresses' : serviceType === 'car' ? 'vehicles' : 'bikes'} added yet
          </p>
          <Button 
            onClick={() => isHomeService ? setIsAddressDialogOpen(true) : setIsVehicleModalOpen(true)} 
            className="h-10 sm:h-11 text-sm sm:text-base"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add {isHomeService ? 'Address' : serviceType === 'car' ? 'Vehicle' : 'Bike'}
          </Button>
        </div>
      ) : (
        <RadioGroup value={selectedId} onValueChange={onSelect}>
          <div className="grid gap-3 sm:gap-4">
            {isHomeService
              ? (addresses as Address[]).map((address) => (
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
                ))
              : (vehicles as Vehicle[]).map((vehicle) => (
                  <Card
                    key={vehicle.id}
                    className={`cursor-pointer transition-all border-2 hover:shadow-lg ${
                      selectedId === vehicle.id
                        ? 'ring-2 ring-primary border-primary bg-primary/5'
                        : 'border-border'
                    }`}
                    onClick={() => onSelect(vehicle.id)}
                  >
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <RadioGroupItem value={vehicle.id} id={vehicle.id} className="flex-shrink-0" />
                        <Label htmlFor={vehicle.id} className="flex-1 cursor-pointer min-w-0">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div
                              className={`p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0 ${
                                selectedId === vehicle.id ? 'bg-primary/10' : 'bg-muted'
                              }`}
                            >
                              <Icon
                                className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${
                                  selectedId === vehicle.id ? 'text-primary' : 'text-muted-foreground'
                                }`}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-foreground text-xs sm:text-sm md:text-base truncate">
                                {vehicle.brand} {vehicle.model}
                              </p>
                              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground truncate">
                                {vehicle.plateNumber}
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

      {/* Vehicle Selection Modal */}
      {!isHomeService && (
        <VehicleSelectionModal
          isOpen={isVehicleModalOpen}
          onClose={() => setIsVehicleModalOpen(false)}
          onSelect={handleVehicleSelect}
        />
      )}
    </div>
  );
}
