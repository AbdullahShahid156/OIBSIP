import { Router } from 'express';
import { protect } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { createOrderSchema } from '../../validations/order.js';
import {
  initiateJazzCashPayment,
  jazzCashReturn,
} from '../../controllers/jazzcashController.js';

const router = Router();

router.post('/initiate', protect, validate(createOrderSchema), initiateJazzCashPayment);

router.post('/return', jazzCashReturn);
router.get('/return', jazzCashReturn);

export default router;
