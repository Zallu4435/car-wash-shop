'use client';

import { useState } from 'react';
import { Car, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const mockVehicles = [
  { id: 'veh_001', brand: 'Toyota', model: 'Camry', plateNumber: 'MH12AB1234', year: 2023 },
  { id: 'veh_002', brand: 'Honda', model: 'City', plateNumber: 'MH14CD5678', year: 2022 },
];

const brands = [
  { id: 'brand_toyota', name: 'Toyota' },
  { id: 'brand_honda', name: 'Honda' },
  { id: 'brand_maruti', name: 'Maruti Suzuki' },
];

interface VehicleSelectorProps {
  selectedVehicle: string | null;
  onVehicleSelect: (vehicleId: string) => void;
}

export function VehicleSelector({ selectedVehicle, onVehicleSelect }: VehicleSelectorProps) {
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Select Your Vehicle</h3>
        <Dialog open={isAddingVehicle} onOpenChange={setIsAddingVehicle}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
            </DialogHeader>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label>Brand</Label>
                <Select>
                  <SelectTrigger>
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
                <Label>Model</Label>
                <Input placeholder="Enter model" />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input type="number" placeholder="2023" />
              </div>
              <div className="space-y-2">
                <Label>Plate Number (Optional)</Label>
                <Input placeholder="MH12AB1234" />
              </div>
              <Button type="submit" className="w-full" size="lg">Add Vehicle</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <RadioGroup value={selectedVehicle || undefined} onValueChange={onVehicleSelect}>
        <div className="grid gap-4">
          {mockVehicles.map((vehicle) => (
            <Card 
              key={vehicle.id} 
              className={`cursor-pointer transition-all border-2 hover:shadow-lg ${
                selectedVehicle === vehicle.id ? 'ring-2 ring-primary border-primary bg-primary/5' : ''
              }`}
              onClick={() => onVehicleSelect(vehicle.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <RadioGroupItem value={vehicle.id} id={vehicle.id} />
                  <Label htmlFor={vehicle.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${
                        selectedVehicle === vehicle.id ? 'bg-primary/10' : 'bg-muted'
                      }`}>
                        <Car className={`h-6 w-6 ${
                          selectedVehicle === vehicle.id ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{vehicle.brand} {vehicle.model}</p>
                        <p className="text-sm text-muted-foreground">{vehicle.plateNumber} • {vehicle.year}</p>
                      </div>
                    </div>
                  </Label>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
