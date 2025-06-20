import { Router } from 'express';
import authRoutes from './authRoutes.js';
import mangaRoutes from './mangaRoutes.js';
import userRoutes from './userRoutes.js';
import checkTokenBlacklist from '../middleware/checkTokenBlacklist.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/manga', checkTokenBlacklist, mangaRoutes);
router.use('/users', userRoutes);

export default router; 