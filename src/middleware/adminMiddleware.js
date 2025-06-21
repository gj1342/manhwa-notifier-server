import { ForbiddenError } from '../utils/errors.js';
import { ERROR_MESSAGES } from '../config/common.js';

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  next(new ForbiddenError(ERROR_MESSAGES.FORBIDDEN_INSUFFICIENT_PRIVILEGES));
};

export default adminMiddleware; 