import { Router } from 'express';
import healthRoutes from './v1/health.js';
import authRoutes from './v1/auth.js';

const router = Router();

router.use('/v1', healthRoutes);
router.use('/v1/auth', authRoutes);

export default router;
