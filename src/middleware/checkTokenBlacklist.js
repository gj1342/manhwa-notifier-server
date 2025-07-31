import BlacklistedToken from '../models/BlacklistedToken.js';
import { UnauthorizedError } from '../utils/errors.js';
import { ERROR_MESSAGES, AUTH_CONFIG } from '../config/common.js';

export default async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (auth && auth.startsWith(AUTH_CONFIG.BEARER_PREFIX)) {
      const token = auth.split(' ')[1];
      const found = await BlacklistedToken.findOne({ token });
      if (found) throw new UnauthorizedError(ERROR_MESSAGES.SESSION_REVOKED);
    }
    next();
  } catch (error) {
    next(error);
  }
}; 