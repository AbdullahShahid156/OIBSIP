import { Router } from 'express';
import healthRoutes from './v1/health.js';

const router = Router();

router.use('/v1', healthRoutes);

export default router;
