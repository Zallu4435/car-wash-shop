import { z } from 'zod';

// ============================================
// Reusable Field Validations
// ============================================

// Address line validation
const addressLineValidation = z
  .string()
  .trim()
  .min(5, 'Address must be at least 5 characters')
  .max(100, 'Address is too long');

// Landmark validation
const landmarkValidation = z
  .string()
  .trim()
  .min(3, 'Landmark must be at least 3 characters')
  .max(50, 'Landmark is too long')
  .optional()
  .or(z.literal(''));

// City validation
const cityValidation = z
  .string()
  .trim()
  .min(2, 'City name is required')
  .max(50, 'City name is too long')
  .regex(/^[a-zA-Z\s]+$/, 'City name can only contain letters and spaces');

// State validation
const stateValidation = z
  .string()
  .trim()
  .min(2, 'State is required')
  .max(50, 'State name is too long')
  .regex(/^[a-zA-Z\s]+$/, 'State name can only contain letters and spaces');

// Pincode validation (Indian)
const pincodeValidation = z
  .string()
  .trim()
  .regex(/^\d{6}$/, 'Pincode must be exactly 6 digits');

// Phone validation for Indian numbers
const phoneValidation = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number')
  .optional()
  .or(z.literal(''));

// Label validation
const labelValidation = z
  .string()
  .min(1, 'Please select an address type')
  .refine(
    (val) => ['home', 'work', 'other'].includes(val),
    { message: 'Please select a valid address type' }
  ) as any;

// ============================================
// Add Address Schema
// ============================================

export const addAddressSchema = z.object({
  label: labelValidation,
  addressLine1: addressLineValidation,
  addressLine2: z
    .string()
    .trim()
    .max(100, 'Address is too long')
    .optional()
    .or(z.literal('')),
  landmark: landmarkValidation,
  city: cityValidation,
  state: stateValidation,
  pincode: pincodeValidation,
  phone: phoneValidation,
  isDefault: z.boolean().default(false),
});

// ============================================
// Edit Address Schema
// ============================================

export const editAddressSchema = addAddressSchema.extend({
  id: z.string().min(1, 'Address ID is required'),
});

// ============================================
// Type Exports
// ============================================

export type AddAddressInput = z.infer<typeof addAddressSchema>;
export type EditAddressInput = z.infer<typeof editAddressSchema>;
