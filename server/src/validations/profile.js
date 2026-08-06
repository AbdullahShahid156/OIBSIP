import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .trim()
    .optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-()]{7,20}$/, 'Please provide a valid phone number')
    .optional()
    .or(z.literal('')),
});

export const changePasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const addressSchema = z.object({
  recipientName: z
    .string()
    .min(2, 'Recipient name must be at least 2 characters')
    .max(100, 'Recipient name must be at most 100 characters')
    .trim(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-()]{7,20}$/, 'Please provide a valid phone number'),
  houseFlat: z
    .string()
    .min(1, 'House/Flat number is required')
    .max(100, 'Must be at most 100 characters')
    .trim(),
  street: z
    .string()
    .min(1, 'Street is required')
    .max(200, 'Must be at most 200 characters')
    .trim(),
  area: z.string().max(100, 'Must be at most 100 characters').trim().optional().default(''),
  city: z
    .string()
    .min(1, 'City is required')
    .max(100, 'Must be at most 100 characters')
    .trim(),
  postalCode: z
    .string()
    .min(1, 'Postal code is required')
    .max(20, 'Must be at most 20 characters')
    .trim(),
  label: z.enum(['home', 'office', 'other']).default('home'),
  isDefault: z.boolean().optional().default(false),
});
