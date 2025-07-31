import { Router } from 'express';
import authRoutes from './authRoutes.js';
import mangaRoutes from './mangaRoutes.js';
import userRoutes from './userRoutes.js';
import adminRoutes from './adminRoutes.js';
import checkTokenBlacklist from '../middleware/checkTokenBlacklist.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/manga', checkTokenBlacklist, mangaRoutes);
router.use('/users', userRoutes);
router.use('/admin', authMiddleware, adminMiddleware, adminRoutes);

export default router; 