import { body } from 'express-validator';
import { VALIDATION_MESSAGES } from '../config/common.js';

export const registerValidation = [
  body('email').isEmail().withMessage(VALIDATION_MESSAGES.EMAIL_REQUIRED),
  body('password').isLength({ min: 8 }).withMessage(VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH),
];

export const trackedMangaValidation = [
  body('url').isURL().withMessage(VALIDATION_MESSAGES.URL_REQUIRED),
  body('mangaTitle').notEmpty().withMessage(VALIDATION_MESSAGES.MANGA_TITLE_REQUIRED),
  body('notificationEnabled').optional().isBoolean().withMessage(VALIDATION_MESSAGES.NOTIFICATION_BOOLEAN),
]; 