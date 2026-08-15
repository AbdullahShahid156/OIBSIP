import { Router } from 'express';
import { protect } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createOrderSchema, verifyPaymentSchema } from '../../validations/order.js';
import {
  createOrder,
  verifyPayment,
  testPayment,
  getOrder,
  getOrders,
} from '../../controllers/orderController.js';

const router = Router();

router.post('/create', protect, validate(createOrderSchema), createOrder);
router.post('/verify', protect, validate(verifyPaymentSchema), verifyPayment);
router.post('/test-pay', protect, testPayment);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrder);

export default router;
