import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  applyCoupon,
  removeCoupon,
  validateCheckout,
} from '../../controllers/cartController.js';
import { protect } from '../../middleware/auth.js';
import { validate } from '../../middleware/index.js';
import {
  addCartItemSchema,
  updateCartItemSchema,
  applyCouponSchema,
  checkoutSchema,
} from '../../validations/cart.js';

const router = Router();

router.use(protect);

router.get('/', getCart);
router.post('/items', validate(addCartItemSchema), addToCart);
router.delete('/clear', clearCart);
router.patch('/items/:itemId', validate(updateCartItemSchema), updateCartItem);
router.delete('/items/:itemId', removeCartItem);
router.post('/coupon/apply', validate(applyCouponSchema), applyCoupon);
router.delete('/coupon/remove', removeCoupon);
router.post('/validate-checkout', validate(checkoutSchema), validateCheckout);

export default router;
