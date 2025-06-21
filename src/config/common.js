import {
  PORT,
  MONGODB_URI,
  NODE_ENV,
  JWT_SECRET,
  SERVER_URL,
  ADMIN_CREATION_SECRET,
} from './env.js';

export const ERROR_MESSAGES = {
  MONGODB_URI_NOT_DEFINED: 'MONGODB_URI is not defined in environment variables',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  UNAUTHORIZED: 'Unauthorized access',
  NO_TOKEN_PROVIDED: 'No token provided',
  INVALID_TOKEN: 'Invalid token',
  SESSION_REVOKED: 'Session revoked. Please log in again.',
  MANGA_NOT_FOUND: 'Manga not found',
  FORBIDDEN: 'Forbidden',
  FORBIDDEN_INSUFFICIENT_PRIVILEGES: 'Forbidden: insufficient privileges',
  USER_ALREADY_EXISTS: 'User already exists',
  PASSWORD_REQUIREMENTS: 'Password does not meet security requirements',
  INVALID_VERIFICATION_TOKEN: 'Invalid or expired verification token',
  EMAIL_NOT_VERIFIED: 'Email not verified',
  INVALID_RESET_TOKEN: 'Invalid or expired reset token',
  SERVER_ERROR: 'An internal server error occurred',
  TOO_MANY_REQUESTS: 'Too many requests, please try again later.',
};

export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'A valid email is required',
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters',
  URL_REQUIRED: 'A valid URL is required',
  MANGA_TITLE_REQUIRED: 'Manga title is required',
  NOTIFICATION_BOOLEAN: 'Notification enabled must be a boolean',
};

export const RESPONSE_MESSAGES = {
  REGISTER_SUCCESS: 'User registered. Please check your email to verify your account.',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  EMAIL_VERIFIED: 'Email verified successfully.',
  PASSWORD_RESET_SENT: 'Password reset email sent.',
  PASSWORD_RESET_SUCCESS: 'Password reset successful.',
  USER_SOFT_DELETED: 'User soft deleted',
  USER_HARD_DELETED: 'User hard deleted',
  MANGA_ADDED: 'Manga added successfully',
  MANGA_UPDATED: 'Manga updated successfully',
  MANGA_DELETED: 'Manga deleted successfully',
  MONGODB_CONNECTED: 'MongoDB connected',
};

export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

export const COLLECTION_NAMES = {
  USERS: 'users',
  TRACKED_MANGA: 'trackedmanga',
  SCRAPING_CONFIG: 'scrapingconfigs',
};

export const BCRYPT_SALT_ROUNDS = 12;

export {
  PORT,
  MONGODB_URI,
  NODE_ENV,
  JWT_SECRET,
  SERVER_URL,
  ADMIN_CREATION_SECRET,
};
