import { Router } from 'express';
import healthRoutes from './v1/health.js';
import authRoutes from './v1/auth.js';
import pizzaRoutes from './v1/pizza.js';

const router = Router();

router.use('/v1', healthRoutes);
router.use('/v1/auth', authRoutes);
router.use('/v1/pizzas', pizzaRoutes);

export default router;
