import { Router } from 'express';
import auth from '../middleware/authMiddleware.js';
import {
  createManga,
  getManga,
  getMangaById,
  updateManga,
  deleteManga,
} from '../controllers/mangaController.js';

const router = Router();

router.use(auth);

router.route('/').post(createManga).get(getManga);
router.route('/:id').get(getMangaById).put(updateManga).delete(deleteManga);

export default router; 