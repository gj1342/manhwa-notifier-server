export const ERROR_MESSAGES = {
  MONGODB_URI_NOT_DEFINED: 'MONGODB_URI is not defined in environment variables',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  UNAUTHORIZED: 'Unauthorized access',
  MANGA_NOT_FOUND: 'Manga not found',
  FORBIDDEN: 'Forbidden',
  SERVER_ERROR: 'Internal server error',
};

export const RESPONSE_MESSAGES = {
  REGISTER_SUCCESS: 'Registration successful',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
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

export const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;
