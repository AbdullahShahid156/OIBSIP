import { z } from 'zod';

const veggieQtySchema = z.record(z.string(), z.number().min(1).max(5));

export const addCartItemSchema = z.object({
  pizzaId: z.string().min(1, 'Pizza ID is required'),
  name: z.string().min(1).max(100),
  image: z.string().optional().default(''),
  size: z.string().min(1),
  base: z.string().min(1),
  baseName: z.string().optional().default(''),
  sauce: z.string().min(1),
  sauceName: z.string().optional().default(''),
  cheese: z.string().min(1),
  cheeseName: z.string().optional().default(''),
  veggies: veggieQtySchema.optional().default({}),
  veggieNames: z.record(z.string(), z.string()).optional().default({}),
  qty: z.number().min(1).max(10).default(1),
  unitPrice: z.number().min(0),
  totalPrice: z.number().min(0),
  prepTime: z.number().min(5).default(10),
  isCustomized: z.boolean().optional().default(false),
  configurationId: z.string().min(1),
});

export const updateCartItemSchema = z.object({
  qty: z.number().min(1).max(10),
});

export const applyCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required').max(30),
});

export const checkoutSchema = z.object({
  addressId: z.string().min(1, 'Delivery address is required'),
  paymentMethod: z.string().optional().default('pending'),
  notes: z.string().max(500).optional().default(''),
});
