import type { Vehicle } from '@/types/vehicle';

/**
 * Get vehicle category from vehicle (handles both old and new format)
 */
export function getVehicleCategory(vehicle: Vehicle | null): string | null {
  if (!vehicle) return null;
  if (vehicle.category) return vehicle.category;
  // Legacy: infer from type
  if (vehicle.type === 'bike') return 'bike';
  return 'car';
}

/**
 * Get vehicle body type from vehicle (handles both old and new format)
 */
export function getVehicleBodyType(vehicle: Vehicle | null): string | null {
  if (!vehicle) return null;
  if (vehicle.bodyType) return vehicle.bodyType;
  // Legacy: infer from type
  if (vehicle.type === 'bike') return 'bike';
  return vehicle.type || null;
}

/**
 * Get display type for vehicle (for backward compatibility)
 * Returns the bodyType for cars, or 'bike' for bikes
 */
export function getVehicleDisplayType(vehicle: Vehicle | null): string {
  if (!vehicle) return '';
  if (vehicle.bodyType) return vehicle.bodyType;
  // Legacy fallback
  return vehicle.type || '';
}

/**
 * Normalize vehicle category from any string
 */
export function normalizeVehicleCategory(type: string): 'car' | 'bike' | 'other' {
  const normalized = type.toLowerCase();
  if (normalized === 'bike') return 'bike';
  if (normalized === 'car') return 'car';
  const BIKE_KEYWORDS = ['bike', 'motorcycle', 'scooter', 'super-bike', 'sports-bike', 'cruiser', 'scooty'];
  const CAR_KEYWORDS = ['car', 'sedan', 'suv', 'hatchback', 'crossover', 'mpv', 'pickup'];
  if (BIKE_KEYWORDS.some((keyword) => normalized.includes(keyword))) return 'bike';
  if (CAR_KEYWORDS.some((keyword) => normalized.includes(keyword))) return 'car';
  return 'other';
}

/**
 * Check if vehicle is a car type
 */
export function isCarType(vehicle: Vehicle | null): boolean {
  const category = getVehicleCategory(vehicle);
  return category === 'car';
}

/**
 * Check if vehicle is a bike type
 */
export function isBikeType(vehicle: Vehicle | null): boolean {
  const category = getVehicleCategory(vehicle);
  return category === 'bike';
}

