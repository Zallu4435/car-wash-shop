'use client';

import { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import { useVehicles } from '@/api/domains/vehicles/queries';
import type { Vehicle } from '@/types/vehicle';

interface VehicleContextValue {
  selectedVehicle: Vehicle | null;
  vehicles: Vehicle[];
  isLoading: boolean;
  selectVehicle: (vehicleId: string) => void;
  clearVehicle: () => void;
  hasVehicles: boolean;
}

const VehicleContext = createContext<VehicleContextValue | undefined>(undefined);

const STORAGE_KEY = 'selectedVehicleId';

export function VehicleProvider({ children }: { children: ReactNode }) {
  const { data: vehiclesData, isLoading } = useVehicles();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const vehicles = vehiclesData || [];
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || null;
  const hasVehicles = vehicles.length > 0;

  // Keep selection in sync when vehicles update (e.g., after setting primary)
  useEffect(() => {
    if (!selectedVehicleId || !isInitialized) return;
    
    // If selected vehicle no longer exists, clear selection
    if (vehicles.length > 0 && !vehicles.some(v => v.id === selectedVehicleId)) {
      const primaryVehicle = vehicles.find(v => v.isPrimary);
      const fallbackVehicle = primaryVehicle || vehicles[0];
      if (fallbackVehicle) {
        setSelectedVehicleId(fallbackVehicle.id);
        localStorage.setItem(STORAGE_KEY, fallbackVehicle.id);
      }
    }
  }, [vehicles, selectedVehicleId, isInitialized]);

  // Initialize: Load from localStorage or auto-select primary/first vehicle (only once)
  useEffect(() => {
    if (isLoading || vehicles.length === 0 || isInitialized) return;

    const savedVehicleId = localStorage.getItem(STORAGE_KEY);
    
    // If saved vehicle exists in current vehicles list, use it
    if (savedVehicleId && vehicles.some(v => v.id === savedVehicleId)) {
      setSelectedVehicleId(savedVehicleId);
    } 
    // Auto-select primary vehicle if available (real-world pattern)
    else {
      const primaryVehicle = vehicles.find(v => v.isPrimary);
      const vehicleToSelect = primaryVehicle || vehicles[0];
      
      if (vehicleToSelect) {
        setSelectedVehicleId(vehicleToSelect.id);
        localStorage.setItem(STORAGE_KEY, vehicleToSelect.id);
      }
    }
    
    setIsInitialized(true);
  }, [vehicles, isLoading, isInitialized]);

  const selectVehicle = useCallback((vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      setSelectedVehicleId(vehicleId);
      localStorage.setItem(STORAGE_KEY, vehicleId);
    }
  }, [vehicles]);

  const clearVehicle = useCallback(() => {
    setSelectedVehicleId(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value: VehicleContextValue = useMemo(() => ({
    selectedVehicle,
    vehicles,
    isLoading,
    selectVehicle,
    clearVehicle,
    hasVehicles,
  }), [selectedVehicle, vehicles, isLoading, selectVehicle, clearVehicle, hasVehicles]);

  return <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>;
}

export function useVehicleContext() {
  const context = useContext(VehicleContext);
  if (context === undefined) {
    throw new Error('useVehicleContext must be used within a VehicleProvider');
  }
  return context;
}
