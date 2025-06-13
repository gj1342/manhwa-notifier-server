import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import { registerValidation } from '../middleware/validation.js';
import { validationResult } from 'express-validator';

const router = Router();

router.post('/register', registerValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  register(req, res, next);
});
router.post('/login', login);

export default router; 