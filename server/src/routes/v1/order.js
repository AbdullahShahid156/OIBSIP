import { Router } from 'express';
import { protect } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createOrderSchema, verifyPaymentSchema } from '../../validations/order.js';
import {
  createOrder,
  verifyPayment,
  getOrder,
  getOrders,
} from '../../controllers/orderController.js';

const router = Router();

router.use(protect);

router.post('/create', validate(createOrderSchema), createOrder);
router.post('/verify', validate(verifyPaymentSchema), verifyPayment);
router.get('/', getOrders);
router.get('/:id', getOrder);

export default router;
