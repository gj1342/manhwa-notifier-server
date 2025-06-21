import { BaseError } from '../utils/errors.js';
import logger from '../config/logger.js';

const errorHandler = (err, req, res, next) => {
  logger.error(err);

  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({ error: { message: err.message } });
  }

  const statusCode = 500;
  res.status(statusCode).json({
    error: { message: 'An unexpected error occurred on the server.' },
  });
};

export default errorHandler;