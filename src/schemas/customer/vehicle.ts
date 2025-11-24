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

// Brand validation
const brandValidation = z
  .string()
  .trim()
  .min(1, 'Please select a brand')
  .max(50, 'Brand name is too long');

// Model validation
const modelValidation = z
  .string()
  .trim()
  .min(1, 'Please select a model')
  .max(50, 'Model name is too long');

// Year validation
const yearValidation = z
  .string()
  .trim()
  .regex(/^\d{4}$/, 'Year must be 4 digits')
  .transform((val) => parseInt(val))
  .refine(
    (year) => {
      const currentYear = new Date().getFullYear();
      return year >= 1990 && year <= currentYear + 1;
    },
    { message: 'Please enter a valid year (1990 to current year)' }
  );

// Plate number validation (Indian format)
const plateNumberValidation = z
  .string()
  .trim()
  .min(8, 'Plate number is too short')
  .max(12, 'Plate number is too long')
  .regex(
    /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$/i,
    'Invalid plate number format (e.g., MH12AB1234)'
  )
  .transform((val) => val.toUpperCase());

// Color validation
const colorValidation = z
  .string()
  .trim()
  .min(1, 'Please select a color')
  .max(30, 'Color name is too long')
  .optional()
  .or(z.literal(''));

// Fuel type validation
const fuelTypeValidation = z
  .string()
  .min(1, 'Please select fuel type')
  .refine(
    (val) => ['petrol', 'diesel', 'electric', 'hybrid', 'cng'].includes(val),
    { message: 'Please select a valid fuel type' }
  )
  .optional() as any;

// ============================================
// Add Vehicle Schema
// ============================================

export const addVehicleSchema = z.object({
  category: vehicleCategoryValidation,
  bodyType: vehicleBodyTypeValidation,
  brand: brandValidation,
  model: modelValidation,
  year: yearValidation,
  plateNumber: plateNumberValidation,
  color: colorValidation,
  fuelType: fuelTypeValidation,
  isDefault: z.boolean().default(false),
});

// ============================================
// Edit Vehicle Schema
// ============================================

export const editVehicleSchema = addVehicleSchema.extend({
  id: z.string().min(1, 'Vehicle ID is required'),
});

// ============================================
// Quick Add Vehicle Schema (Minimal fields)
// ============================================

export const quickAddVehicleSchema = z.object({
  category: vehicleCategoryValidation,
  bodyType: vehicleBodyTypeValidation,
  brand: brandValidation,
  model: modelValidation,
  plateNumber: plateNumberValidation,
});

// ============================================
// Type Exports
// ============================================

export type AddVehicleInput = z.infer<typeof addVehicleSchema>;
export type EditVehicleInput = z.infer<typeof editVehicleSchema>;
export type QuickAddVehicleInput = z.infer<typeof quickAddVehicleSchema>;
