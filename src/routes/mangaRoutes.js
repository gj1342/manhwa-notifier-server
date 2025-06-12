const { Router } = require('express');
const auth = require('../middleware/authMiddleware');
const {
  createManga,
  getManga,
  getMangaById,
  updateManga,
  deleteManga,
} = require('../controllers/mangaController');

const router = Router();

router.use(auth);

router.route('/').post(createManga).get(getManga);
router.route('/:id').get(getMangaById).put(updateManga).delete(deleteManga);

module.exports = router; 