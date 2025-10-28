'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Car, Bike, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { VehicleSelectionModal } from '@/components/shared/selectors/VehicleSelectionModal';

interface Vehicle {
  id: string;
  type: 'car' | 'bike';
  category: string;
  brand: string;
  model: string;
  plateNumber?: string;
  year: string;
}

const mockVehicles: Vehicle[] = [
  { id: 'veh_001', type: 'car', category: 'sedan', brand: 'Maruti', model: 'Dzire', plateNumber: 'MH12AB1234', year: '2023' },
  { id: 'veh_002', type: 'car', category: 'sedan', brand: 'Honda', model: 'City', plateNumber: 'MH14CD5678', year: '2022' },
  { id: 'veh_003', type: 'car', category: 'hatchback', brand: 'Maruti', model: 'Swift', plateNumber: 'MH12EF9012', year: '2021' },
  { id: 'veh_004', type: 'car', category: 'suv', brand: 'Tata', model: 'Nexon', plateNumber: 'MH14GH3456', year: '2023' },
  { id: 'veh_005', type: 'bike', category: 'scooter', brand: 'Honda', model: 'Activa', plateNumber: 'MH12IJ7890', year: '2022' },
  { id: 'veh_006', type: 'bike', category: 'motorcycle', brand: 'Royal Enfield', model: 'Classic 350', plateNumber: 'MH14KL1234', year: '2023' },
];

export default function VehiclesPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState(mockVehicles);
  const [deleteVehicleId, setDeleteVehicleId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleDelete = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
    toast.success('Vehicle removed successfully');
    setDeleteVehicleId(null);
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: `veh_${Date.now()}`,
    };
    
    setVehicles(prev => [...prev, newVehicle]);
    toast.success('Vehicle added successfully!');
  };

  const carVehicles = vehicles.filter(v => v.type === 'car');
  const bikeVehicles = vehicles.filter(v => v.type === 'bike');

  const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => {
    const Icon = vehicle.type === 'car' ? Car : Bike;
    const categoryLabel = vehicle.category.charAt(0).toUpperCase() + vehicle.category.slice(1);
    
    return (
      <Card className="border-2 hover:shadow-lg transition-all group">
        <CardContent className="p-4 sm:p-5 md:p-6">
          {/* Desktop Layout */}
          <div className="hidden sm:flex items-start gap-3 sm:gap-4">
            <div 
              className="p-3 sm:p-4 rounded-lg sm:rounded-xl flex-shrink-0 transition-transform group-hover:scale-110"
              style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
            >
              <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" style={{ color: 'hsl(var(--primary))' }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1.5 sm:mb-2">
                <h3 className="font-bold text-base sm:text-lg md:text-xl text-foreground truncate">
                  {vehicle.brand} {vehicle.model}
                </h3>
                <Badge variant="secondary" className="text-xs flex-shrink-0">
                  {categoryLabel}
                </Badge>
              </div>
              <p className="text-muted-foreground font-mono text-sm sm:text-base md:text-lg mb-0.5 sm:mb-1 truncate">
                {vehicle.plateNumber}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Year: {vehicle.year}
              </p>
            </div>
            <div className="flex flex-col gap-1.5 sm:gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10 hover:text-primary h-8 w-8 sm:h-9 sm:w-9"
                onClick={() => toast.info('Edit functionality coming soon')}
              >
                <Edit className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 h-8 w-8 sm:h-9 sm:w-9"
                onClick={() => setDeleteVehicleId(vehicle.id)}
              >
                <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="sm:hidden">
            <div className="flex items-start gap-3 mb-3">
              <div 
                className="p-3 rounded-lg flex-shrink-0"
                style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
              >
                <Icon className="h-6 w-6" style={{ color: 'hsl(var(--primary))' }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-foreground line-clamp-2 mb-1">
                  {vehicle.brand} {vehicle.model}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {categoryLabel}
                </Badge>
              </div>
            </div>
            <div className="mb-3">
              <p className="text-muted-foreground font-mono text-sm mb-1">
                {vehicle.plateNumber}
              </p>
              <p className="text-xs text-muted-foreground">
                Year: {vehicle.year}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-9"
                onClick={() => toast.info('Edit functionality coming soon')}
              >
                <Edit className="h-4 w-4 mr-1.5" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 h-9"
                onClick={() => setDeleteVehicleId(vehicle.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Responsive */}
      <section className="bg-gradient-to-br from-primary/5 to-background border-b border-border">
        <div className="container-custom py-6 sm:py-8 lg:py-12">
          <Button
            variant="ghost"
            onClick={() => router.push('/profile')}
            className="mb-3 sm:mb-4 hover:bg-muted h-9 sm:h-10"
          >
            <ArrowLeft className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">Back to Profile</span>
          </Button>
          <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div 
                className="p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0"
                style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
              >
                <Car className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" style={{ color: 'hsl(var(--primary))' }} />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground truncate">
                  My Vehicles
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">
                  {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} registered
                </p>
              </div>
            </div>
            <Button 
              className="shadow-lg h-9 sm:h-10 flex-shrink-0"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline text-xs sm:text-sm">Add Vehicle</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container-custom">
          {vehicles.length === 0 ? (
            <div className="max-w-2xl mx-auto text-center py-12 sm:py-16">
              <div 
                className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-4 sm:mb-6"
                style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
              >
                <Car className="h-10 w-10 sm:h-12 sm:w-12" style={{ color: 'hsl(var(--primary))' }} />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-2">No Vehicles Added Yet</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 px-4">
                Add your first vehicle to get started with quick bookings
              </p>
              <Button 
                size="lg" 
                onClick={() => setIsAddModalOpen(true)}
                className="h-10 sm:h-11"
              >
                <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Add Your First Vehicle</span>
              </Button>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
              {/* Cars Section */}
              {carVehicles.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <Car className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: 'hsl(var(--primary))' }} />
                    <h2 className="text-xl sm:text-2xl font-bold">Cars</h2>
                    <Badge variant="secondary" className="text-xs sm:text-sm">{carVehicles.length}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {carVehicles.map((vehicle) => (
                      <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))}
                  </div>
                </div>
              )}

              {/* Bikes Section */}
              {bikeVehicles.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <Bike className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: 'hsl(var(--primary))' }} />
                    <h2 className="text-xl sm:text-2xl font-bold">Bikes</h2>
                    <Badge variant="secondary" className="text-xs sm:text-sm">{bikeVehicles.length}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {bikeVehicles.map((vehicle) => (
                      <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Vehicle Selection Modal */}
      <VehicleSelectionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSelect={handleVehicleSelect}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteVehicleId} onOpenChange={() => setDeleteVehicleId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Are you sure?</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              This will permanently remove this vehicle from your account. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteVehicleId(null)}
              className="h-10 sm:h-11 text-xs sm:text-sm"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteVehicleId && handleDelete(deleteVehicleId)}
              className="h-10 sm:h-11 text-xs sm:text-sm"
            >
              Delete Vehicle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
