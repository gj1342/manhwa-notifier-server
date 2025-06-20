import BlacklistedToken from '../models/BlacklistedToken.js';
import { UnauthorizedError } from '../utils/errors.js';

export default async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) {
      const token = auth.split(' ')[1];
      const found = await BlacklistedToken.findOne({ token });
      if (found) throw new UnauthorizedError('Session revoked. Please log in again.');
    }
    next();
  } catch (error) {
    next(error);
  }
}; 