import { z } from 'zod';

export const createOrderSchema = z.object({
  addressId: z.string().min(1, 'Delivery address is required'),
  notes: z.string().max(500).optional().default(''),
});

export const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string().min(1, 'Razorpay order ID is required'),
  razorpayPaymentId: z.string().min(1, 'Razorpay payment ID is required'),
  razorpaySignature: z.string().min(1, 'Payment signature is required'),
  orderId: z.string().min(1, 'Order ID is required'),
});
