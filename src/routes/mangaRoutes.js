import { Router } from 'express';
import auth from '../middleware/authMiddleware.js';
import {
  createManga,
  getManga,
  getMangaById,
  updateManga,
  deleteManga,
} from '../controllers/mangaController.js';
import { trackedMangaValidation } from '../middleware/validation.js';
import { validationResult } from 'express-validator';

const router = Router();

router.use(auth);

router.route('/')
  .post(trackedMangaValidation, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    createManga(req, res, next);
  })
  .get(getManga);
router.route('/:id').get(getMangaById).put(updateManga).delete(deleteManga);

export default router; 