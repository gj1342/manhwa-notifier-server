import rateLimit from 'express-rate-limit';
import { ERROR_MESSAGES } from '../config/common.js';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: ERROR_MESSAGES.TOO_MANY_REQUESTS },
}); 