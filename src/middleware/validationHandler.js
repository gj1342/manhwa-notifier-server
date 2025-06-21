import { validationResult } from 'express-validator';
import { BadRequestError } from '../utils/errors.js';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new BadRequestError(errors.array()[0].msg);
  }
  next();
};

export default handleValidationErrors; 