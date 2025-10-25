'use client';

import { useState } from 'react';
import { Car, Bike, Plus, MapPin, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { bookingApi, Vehicle, Address } from '@/lib/api/bookingApi';

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [year, setYear] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [addressLabel, setAddressLabel] = useState('');
  const [addressText, setAddressText] = useState('');

  const Icon = serviceType === 'car' ? Car : serviceType === 'bike' ? Bike : MapPin;
  const isHomeService = serviceType === 'home';

  // Load brands when dialog opens
  const handleDialogOpen = async (open: boolean) => {
    setIsDialogOpen(open);
    if (open && !isHomeService) {
      setLoading(true);
      try {
        const brandsData = await bookingApi.getVehicleBrands(serviceType);
        setBrands(brandsData);
      } catch (error) {
        toast.error('Failed to load brands');
      } finally {
        setLoading(false);
      }
    }
  };

  // Load models when brand changes
  const handleBrandChange = async (brandId: string) => {
    setSelectedBrand(brandId);
    setSelectedModel('');
    setLoading(true);
    try {
      const modelsData = await bookingApi.getModelsByBrand(brandId);
      setModels(modelsData);
    } catch (error) {
      toast.error('Failed to load models');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isHomeService) {
        if (!addressLabel || !addressText) {
          toast.error('Please fill all fields');
          return;
        }
        await bookingApi.addAddress({
          label: addressLabel,
          address: addressText,
        });
        toast.success('Address added successfully');
      } else {
        if (!selectedBrand || !selectedModel || !year) {
          toast.error('Please fill all required fields');
          return;
        }
        await bookingApi.addVehicle({
          brandId: selectedBrand,
          modelId: selectedModel,
          year: parseInt(year),
          plateNumber: plateNumber || undefined,
          vehicleTypeId: serviceType,
        });
        toast.success(`${serviceType === 'car' ? 'Vehicle' : 'Bike'} added successfully`);
      }

      // Reset form
      setSelectedBrand('');
      setSelectedModel('');
      setYear('');
      setPlateNumber('');
      setAddressLabel('');
      setAddressText('');
      setIsDialogOpen(false);
      
      // Refresh list
      onVehicleAdded();
    } catch (error) {
      toast.error('Failed to add');
    } finally {
      setLoading(false);
    }
  };

  const items = isHomeService ? addresses : vehicles;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-foreground">
          {isHomeService
            ? 'Select Address'
            : `Select Your ${serviceType === 'car' ? 'Vehicle' : 'Bike'}`}
        </h3>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Add {isHomeService ? 'Address' : serviceType === 'car' ? 'Vehicle' : 'Bike'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                Add New {isHomeService ? 'Address' : serviceType === 'car' ? 'Vehicle' : 'Bike'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isHomeService ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="label">Label *</Label>
                    <Select value={addressLabel} onValueChange={setAddressLabel}>
                      <SelectTrigger id="label">
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
                    <Label htmlFor="address">Complete Address *</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter full address with landmarks"
                      rows={4}
                      value={addressText}
                      onChange={(e) => setAddressText(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand *</Label>
                    <Select
                      value={selectedBrand}
                      onValueChange={handleBrandChange}
                      disabled={loading}
                    >
                      <SelectTrigger id="brand">
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model *</Label>
                    <Select
                      value={selectedModel}
                      onValueChange={setSelectedModel}
                      disabled={!selectedBrand || loading}
                    >
                      <SelectTrigger id="model">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        {models.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year *</Label>
                    <Input
                      id="year"
                      type="number"
                      placeholder="2023"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      min="1900"
                      max={new Date().getFullYear() + 1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plate">Plate Number (Optional)</Label>
                    <Input
                      id="plate"
                      placeholder="MH12AB1234"
                      value={plateNumber}
                      onChange={(e) => setPlateNumber(e.target.value)}
                    />
                  </div>
                </>
              )}
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  `Add ${isHomeService ? 'Address' : serviceType === 'car' ? 'Vehicle' : 'Bike'}`
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">
            No {isHomeService ? 'addresses' : serviceType === 'car' ? 'vehicles' : 'bikes'} added yet
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add {isHomeService ? 'Address' : serviceType === 'car' ? 'Vehicle' : 'Bike'}
          </Button>
        </div>
      ) : (
        <RadioGroup value={selectedId} onValueChange={onSelect}>
          <div className="grid gap-4">
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
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <RadioGroupItem
                          value={address.id}
                          id={address.id}
                          className="mt-1 flex-shrink-0"
                        />
                        <Label htmlFor={address.id} className="flex-1 cursor-pointer min-w-0">
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 sm:p-3 rounded-xl flex-shrink-0 ${
                                selectedId === address.id ? 'bg-primary/10' : 'bg-muted'
                              }`}
                            >
                              <MapPin
                                className={`h-5 w-5 sm:h-6 sm:w-6 ${
                                  selectedId === address.id ? 'text-primary' : 'text-muted-foreground'
                                }`}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground text-sm sm:text-base">
                                {address.label}
                              </p>
                              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                                {address.address}
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
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <RadioGroupItem value={vehicle.id} id={vehicle.id} className="flex-shrink-0" />
                        <Label htmlFor={vehicle.id} className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 sm:p-3 rounded-xl flex-shrink-0 ${
                                selectedId === vehicle.id ? 'bg-primary/10' : 'bg-muted'
                              }`}
                            >
                              <Icon
                                className={`h-5 w-5 sm:h-6 sm:w-6 ${
                                  selectedId === vehicle.id ? 'text-primary' : 'text-muted-foreground'
                                }`}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground text-sm sm:text-base">
                                {vehicle.brandName} {vehicle.modelName}
                              </p>
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                {vehicle.plateNumber ? `${vehicle.plateNumber} • ` : ''}{vehicle.year}
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
    </div>
  );
}
