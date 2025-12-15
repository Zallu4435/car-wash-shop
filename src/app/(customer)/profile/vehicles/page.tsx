'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Car, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useVehicleContext } from '@/context/VehicleContext';
import { useVehicles, useDeleteVehicle, useUpdateVehicle } from '@/api/domains/vehicles/queries';
import { usePublicVehicleCategories, usePublicVehicleTypes } from '@/api/domains/public-vehicle-types/queries';
import { EmptyState } from '@/components/shared/display/EmptyState';
import { AddVehicleModal } from '@/components/shared/forms/AddVehicleModal';
import Loading from '@/components/shared/display/Loading';
import Error from '@/components/shared/display/Error';
import type { Vehicle } from '@/types/vehicle';
import { CustomerRoutes } from '@/lib/constants/routes';
import { getVehicleCategory, getVehicleDisplayType } from '@/utils/vehicle';

export default function VehiclesPage() {
  const router = useRouter();
  const { data: vehiclesData, isLoading, error } = useVehicles();
  const { data: categories } = usePublicVehicleCategories();
  const { data: vehicleTypes } = usePublicVehicleTypes();
  const { selectVehicle } = useVehicleContext();
  const deleteVehicleMutation = useDeleteVehicle();
  const updateVehicleMutation = useUpdateVehicle();
  const [deleteVehicleId, setDeleteVehicleId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const vehicles = vehiclesData || [];

  // Helper to get category icon
  const getCategoryIcon = (slug: string): string => {
    const cat = categories?.find(c => c.slug === slug);
    return cat?.icon || (slug === 'bike' ? '🏍️' : '🚗');
  };

  // Helper to get type icon
  const getTypeIcon = (category: string, bodyType: string): string => {
    const type = vehicleTypes?.find(t => t.category === category && t.bodyType === bodyType);
    if (type?.icon) return type.icon;
    // Fallback to category icon
    return getCategoryIcon(category);
  };

  const handleDelete = (id: string) => {
    deleteVehicleMutation.mutate(id, {
      onSuccess: () => {
        setDeleteVehicleId(null);
      }
    });
  };

  const handleSetPrimary = (id: string) => {
    updateVehicleMutation.mutate({
      id,
      input: { isPrimary: true }
    }, {
      onSuccess: () => {
        // Auto-select the new primary vehicle
        selectVehicle(id);
        toast.success('Primary vehicle updated');
      }
    });
  };

  const handleAddVehicle = () => {
    setIsAddModalOpen(true);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error message="Failed to load vehicles" />;
  }

  const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => {
    const typeIcon = getTypeIcon(vehicle.category, vehicle.bodyType);

    return (
      <Card className={`border-2 hover:shadow-lg transition-all group ${vehicle.isPrimary ? 'border-primary/50' : ''}`}>
        <CardContent className="p-4 sm:p-5 md:p-6">
          {/* Desktop Layout */}
          <div className="hidden sm:flex items-start gap-3 sm:gap-4">
            <div
              className="p-2 sm:p-3 rounded-lg sm:rounded-xl flex-shrink-0 transition-transform group-hover:scale-105 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center"
            >
              <span className="text-4xl sm:text-5xl md:text-6xl">{typeIcon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1.5 sm:mb-2">
                <h3 className="font-bold text-base sm:text-lg md:text-xl text-foreground truncate capitalize">
                  {getVehicleDisplayType(vehicle)}
                </h3>
                {vehicle.isPrimary && (
                  <Badge className="text-xs flex-shrink-0 bg-primary/10 text-primary border-primary/20">
                    <Star className="h-3 w-3 mr-1 fill-primary" />
                    Primary
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-sm sm:text-base md:text-lg mb-0.5 sm:mb-1 capitalize">
                {vehicle.category}
              </p>
            </div>
            <div className="flex flex-col gap-1.5 sm:gap-2 flex-shrink-0">
              {!vehicle.isPrimary && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary/10 hover:text-primary h-8 w-8 sm:h-9 sm:w-9"
                  onClick={() => handleSetPrimary(vehicle.id)}
                  title="Set as Primary"
                >
                  <Star className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 h-8 w-8 sm:h-9 sm:w-9"
                onClick={() => setDeleteVehicleId(vehicle.id)}
                title="Delete Vehicle"
                disabled={vehicle.isPrimary}
              >
                <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="sm:hidden">
            <div className="flex items-start gap-3 mb-3">
              <div
                className="p-2 rounded-lg flex-shrink-0 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center"
              >
                <span className="text-3xl">{typeIcon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-foreground line-clamp-2 mb-1 capitalize">
                  {getVehicleDisplayType(vehicle)}
                </h3>
                {vehicle.isPrimary && (
                  <Badge className="text-xs bg-primary/10 text-primary border-primary/20">
                    <Star className="h-3 w-3 mr-1 fill-primary" />
                    Primary
                  </Badge>
                )}
              </div>
            </div>
            <div className="mb-3">
              <p className="text-muted-foreground text-sm mb-1 capitalize">
                {vehicle.category}
              </p>
            </div>
            <div className="flex gap-2">
              {!vehicle.isPrimary && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9"
                  onClick={() => handleSetPrimary(vehicle.id)}
                >
                  <Star className="h-4 w-4 mr-1.5" />
                  Set Primary
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 h-9"
                onClick={() => setDeleteVehicleId(vehicle.id)}
                disabled={vehicle.isPrimary}
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
    <div className="min-h-screen bg-background pb-32 lg:pb-8">
      {/* Header Section */}
      <section className="sticky top-0 z-10 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container-custom py-4 sm:py-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 h-9 px-3 text-sm hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <Car className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">My Vehicles</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} registered
                </p>
              </div>
            </div>
            <Button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddVehicle(); }}
              className="h-11 px-6 gap-2 whitespace-nowrap font-semibold"
            >
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Add New</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container-custom">
          {vehicles.length === 0 ? (
            <EmptyState
              icon={Car}
              title="No Vehicles Added Yet"
              description="Add your first vehicle to get started with quick bookings"
              action={
                <Button
                  type="button"
                  size="lg"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddVehicle(); }}
                  className="shadow-lg border-2 h-10 sm:h-11"
                >
                  <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">Add Your First Vehicle</span>
                </Button>
              }
            />
          ) : (
            <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
              {/* Dynamic Category Sections */}
              {(() => {
                // Group vehicles by category
                const groupedVehicles = vehicles.reduce((acc, vehicle) => {
                  const category = getVehicleCategory(vehicle) || 'other';
                  if (!acc[category]) acc[category] = [];
                  acc[category].push(vehicle);
                  return acc;
                }, {} as Record<string, typeof vehicles>);

                return Object.entries(groupedVehicles).map(([category, categoryVehicles]) => (
                  <div key={category}>
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <span className="text-2xl sm:text-3xl">{getCategoryIcon(category)}</span>
                      <h2 className="text-xl sm:text-2xl font-bold capitalize">{category}s</h2>
                      <Badge variant="secondary" className="text-xs sm:text-sm">{categoryVehicles.length}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      {categoryVehicles.map((vehicle) => (
                        <VehicleCard key={vehicle.id} vehicle={vehicle} />
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}
        </div>
      </section>

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
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
