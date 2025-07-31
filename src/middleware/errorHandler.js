import { BaseError } from '../utils/errors.js';
import logger from '../config/logger.js';
import { ERROR_MESSAGES, STATUS_CODES } from '../config/common.js';

const errorHandler = (err, req, res, next) => {
  logger.error(err);

  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({ error: { message: err.message } });
  }

  res.status(STATUS_CODES.SERVER_ERROR).json({
    error: { message: ERROR_MESSAGES.SERVER_ERROR },
  });
};

export default errorHandler;