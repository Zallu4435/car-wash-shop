import { z } from 'zod';

// ============================================
// Reusable Field Validations
// ============================================

// Vehicle category validation
const vehicleCategoryValidation = z
  .string()
  .min(1, 'Please select a vehicle category')
  .refine(
    (val) => ['car', 'bike'].includes(val),
    { message: 'Please select a valid vehicle category' }
  ) as any;

// Vehicle body type validation
const vehicleBodyTypeValidation = z
  .string()
  .min(1, 'Please select a vehicle body type')
  .refine(
    (val) =>
      [
        'sedan',
        'suv',
        'hatchback',
        'luxury',
        'super-bike',
        'sports-bike',
        'cruiser',
        'scooty',
        // Legacy values retained to avoid breaking existing records
        'scooter',
        'motorcycle',
      ].includes(val),
    { message: 'Please select a valid vehicle body type' }
  ) as any;

// ============================================
// Add Vehicle Schema
// ============================================

export const addVehicleSchema = z.object({
  category: vehicleCategoryValidation,
  bodyType: vehicleBodyTypeValidation,
  isDefault: z.boolean().default(false),
});

// ============================================
// Edit Vehicle Schema
// ============================================

export const editVehicleSchema = addVehicleSchema.extend({
  id: z.string().min(1, 'Vehicle ID is required'),
});

// ============================================
// Type Exports
// ============================================

export type AddVehicleInput = z.infer<typeof addVehicleSchema>;
export type EditVehicleInput = z.infer<typeof editVehicleSchema>;
