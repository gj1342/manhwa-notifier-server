import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/errors.js';
import { ERROR_MESSAGES, JWT_SECRET } from '../config/common.js';

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError(ERROR_MESSAGES.NO_TOKEN_PROVIDED);
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError(ERROR_MESSAGES.INVALID_TOKEN));
    }
    next(error);
  }
};

export default authMiddleware; 