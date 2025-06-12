const { Router } = require('express');
const authRoutes = require('./authRoutes');
const mangaRoutes = require('./mangaRoutes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/manga', mangaRoutes);

module.exports = router; 