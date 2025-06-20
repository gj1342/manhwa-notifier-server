import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';
import { UnauthorizedError } from '../utils/errors.js';

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    const decoded = jwt.verify(token, jwtConfig.secret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError('Invalid token'));
    }
    next(error);
  }
};

export default authMiddleware; 