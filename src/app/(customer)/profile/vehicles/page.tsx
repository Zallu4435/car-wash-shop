'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const mockVehicles = [
  { id: 'veh_001', brand: 'Toyota', model: 'Camry', plateNumber: 'MH12AB1234', year: 2023 },
  { id: 'veh_002', brand: 'Honda', model: 'City', plateNumber: 'MH14CD5678', year: 2022 },
];

export default function VehiclesPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
    toast.success('Vehicle removed successfully');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-8 lg:py-12">
          <Button
            variant="ghost"
            onClick={() => router.push('/profile')}
            className="mb-4 hover:bg-muted"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Car className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">My Vehicles</h1>
                <p className="text-muted-foreground mt-1">{vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} registered</p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="shadow-lg">
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Add Vehicle</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Vehicle</DialogTitle>
                </DialogHeader>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    toast.success('Vehicle added!');
                    setIsDialogOpen(false);
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Select required>
                      <SelectTrigger id="brand">
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="toyota">Toyota</SelectItem>
                        <SelectItem value="honda">Honda</SelectItem>
                        <SelectItem value="maruti">Maruti Suzuki</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" placeholder="e.g., Camry" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      placeholder="2023"
                      min="1990"
                      max={new Date().getFullYear() + 1}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="plate">Plate Number (Optional)</Label>
                    <Input id="plate" placeholder="MH12AB1234" />
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    Add Vehicle
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id} className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-4 bg-primary/10 rounded-xl flex-shrink-0">
                      <Car className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xl text-foreground mb-2">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      <p className="text-muted-foreground font-mono">{vehicle.plateNumber}</p>
                      <p className="text-sm text-muted-foreground mt-1">Year: {vehicle.year}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 flex-shrink-0"
                      onClick={() => handleDelete(vehicle.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
