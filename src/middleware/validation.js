import { body } from 'express-validator';

export const registerValidation = [
  body('email').isEmail().withMessage('A valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

export const trackedMangaValidation = [
  body('url').isURL().withMessage('A valid URL is required'),
  body('mangaTitle').notEmpty().withMessage('Manga title is required'),
  body('notificationEnabled').optional().isBoolean().withMessage('Notification enabled must be a boolean'),
]; 