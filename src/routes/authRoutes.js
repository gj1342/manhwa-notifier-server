import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import { registerValidation } from '../middleware/validation.js';
import { validationResult } from 'express-validator';
import { API_ENDPOINTS } from '../config/endpoints.js';

const router = Router();

router.post(API_ENDPOINTS.AUTH.REGISTER, registerValidation, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  register(req, res, next);
});
router.post(API_ENDPOINTS.AUTH.LOGIN, login);

export default router; 