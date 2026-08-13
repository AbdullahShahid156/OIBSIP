import { Router } from 'express';
import healthRoutes from './v1/health.js';
import authRoutes from './v1/auth.js';
import pizzaRoutes from './v1/pizza.js';
import profileRoutes from './v1/profile.js';
import cartRoutes from './v1/cart.js';
import assistantRoutes from './v1/assistant.js';
import orderRoutes from './v1/order.js';
import jazzcashRoutes from './v1/jazzcash.js';

const router = Router();

router.use('/v1', healthRoutes);
router.use('/v1/auth', authRoutes);
router.use('/v1/pizzas', pizzaRoutes);
router.use('/v1/profile', profileRoutes);
router.use('/v1/cart', cartRoutes);
router.use('/v1/assistant', assistantRoutes);
router.use('/v1/orders', orderRoutes);
router.use('/v1/orders/jazzcash', jazzcashRoutes);

export default router;
