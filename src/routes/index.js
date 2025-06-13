import { Router } from 'express';
import authRoutes from './authRoutes.js';
import mangaRoutes from './mangaRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/manga', mangaRoutes);

export default router; 