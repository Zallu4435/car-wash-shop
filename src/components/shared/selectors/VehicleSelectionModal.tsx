'use client';

import { X, Car as CarIcon, Bike, Check, Plus } from 'lucide-react';
import { useVehicleContext } from '@/context/VehicleContext';
import { useRouter } from 'next/navigation';
import type { Vehicle } from '@/types/vehicle';

interface VehicleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (vehicle: Vehicle) => void;
  selectedVehicleId?: string;
}

export function VehicleSelectionModal({ 
  isOpen, 
  onClose, 
  onSelect,
  selectedVehicleId 
}: VehicleSelectionModalProps) {
  const { vehicles } = useVehicleContext();
  const router = useRouter();

  const handleVehicleSelect = (vehicle: Vehicle) => {
    onSelect(vehicle);
    onClose();
  };

  const handleAddVehicle = () => {
    onClose();
    router.push('/profile/vehicles');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with Blur */}
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md dark:bg-black/70"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
        <div className="bg-white dark:bg-card border-2 border-border rounded-2xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col mx-4">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-gray-50 dark:bg-muted/10">
            <div>
              <h2 className="text-lg font-bold text-foreground">My Vehicles</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Select or add a vehicle</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-xl transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-muted/5">
            {vehicles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CarIcon className="h-10 w-10 text-primary" />
                </div>
                <p className="text-base font-semibold text-foreground mb-1">No Vehicles Added</p>
                <p className="text-sm text-muted-foreground mb-6">Add your first vehicle to get started</p>
                <button
                  onClick={handleAddVehicle}
                  className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Vehicle
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {vehicles.map((vehicle) => {
                  const isSelected = vehicle.id === selectedVehicleId;
                  const VehicleIcon = vehicle.type === 'car' ? CarIcon : Bike;
                  const vehicleImage = vehicle.type === 'car' 
                    ? '/images/vehicles/car-placeholder.svg' 
                    : '/images/vehicles/bike-placeholder.svg';

                  return (
                    <button
                      key={vehicle.id}
                      onClick={() => handleVehicleSelect(vehicle)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left group ${
                        isSelected
                          ? 'border-primary bg-primary/10 shadow-sm'
                          : 'border-border hover:border-primary/50 hover:bg-white dark:hover:bg-card hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary/20' : 'bg-muted group-hover:bg-muted/80'}`}>
                          <img 
                            src={vehicleImage} 
                            alt={vehicle.type}
                            className="h-12 w-12 object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">
                            {vehicle.make} {vehicle.model}
                          </p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {vehicle.registrationNumber} • {vehicle.year}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="flex-shrink-0">
                            <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center">
                              <Check className="h-4 w-4 text-white" strokeWidth={3} />
                            </div>
                          </div>
                        )}
                      </div>
                      {vehicle.isPrimary && (
                        <div className="mt-2.5 pt-2.5 border-t border-border/50">
                          <span className="text-xs font-semibold text-primary">⭐ Primary Vehicle</span>
                        </div>
                      )}
                    </button>
                  );
                })}
                
                {/* Add Vehicle Button */}
                <button
                  onClick={handleAddVehicle}
                  className="w-full p-4 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all text-left group mt-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-muted group-hover:bg-primary/10">
                      <Plus className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">Add New Vehicle</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Register another vehicle</p>
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          {vehicles.length > 0 && (
            <div className="px-5 py-3 border-t border-border bg-gray-50 dark:bg-muted/10">
              <p className="text-xs text-muted-foreground text-center">
                {selectedVehicleId ? 'Tap a vehicle to switch' : 'Select a vehicle to continue'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
