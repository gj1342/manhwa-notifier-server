import {
  PORT,
  MONGODB_URI,
  NODE_ENV,
  JWT_SECRET,
  SERVER_URL,
  ADMIN_CREATION_SECRET,
  JWT_EXPIRES_IN,
  PROXY_LIST,
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
  WEBSITE_NOT_SUPPORTED_OR_NO_CHAPTERS: 'This website is not supported or no chapters were found.',
  MANGA_NOT_FOUND_OR_NO_PERMISSION: 'Manga not found or you do not have permission to perform this action.',
  SCRAPING_CONFIG_EXISTS: 'Configuration for domain %s already exists.',
  INVALID_URL_FOR_SCRAPING: 'Invalid URL provided for scraping.',
  FETCH_URL_FAILED: 'Failed to fetch content from the specified URL.',
  PARSE_CONTENT_FAILED: 'Failed to parse or process the content from the URL.',
  SCRAPING_UNSUPPORTED: 'Scraping is not supported for the domain: %s',
  INVALID_NOTIFICATION_SETTINGS: 'Invalid notification settings provided.',
};

export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'A valid email is required',
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters',
  URL_REQUIRED: 'A valid URL is required',
  MANGA_TITLE_REQUIRED: 'Manga title is required',
  NOTIFICATION_BOOLEAN: 'Notification enabled must be a boolean',
  SELECTOR_REQUIRED: 'CSS selector is required',
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

export const LOG_MESSAGES = {
  DB_URI_NOT_FOUND: 'MongoDB URI not found. Please set MONGODB_URI in your .env file.',
  DB_CONNECTED: 'MongoDB connected successfully.',
  DB_CONNECTION_ERROR: 'MongoDB connection error:',
  DB_DISCONNECTED: 'MongoDB disconnected.',
  ADMIN_USER_UPDATED: 'User updated by admin',
  ADMIN_USER_SOFT_DELETED: 'User soft-deleted by admin',
  ADMIN_USER_HARD_DELETED: 'User hard-deleted by admin',
  INVALID_CHAPTER_URL: "Invalid chapter URL '%s' for base URL '%s'.",
  INVALID_MANGA_URL: 'Invalid manga URL provided: %s',
  NO_SCRAPING_CONFIG: 'No scraping configuration found for domain: %s',
  FETCH_HTML_ERROR: 'Error fetching HTML from %s: %s',
  LATEST_CHAPTER_FOUND: 'Latest chapter for %s: %s',
  NO_CHAPTERS_FOUND: "No chapters found for %s with selector '%s'.",
  SCRAPING_ERROR: 'Error scraping %s: %s',
  PUPPETEER_ERROR: 'Puppeteer error while scraping %s: %s',
  USING_PROXY: 'Using proxy: %s',
  CRON_JOB_START: 'Running scheduled job: Checking for manga updates...',
  CRON_JOB_NO_MANGAS: 'No tracked manga with notifications enabled to check. Skipping job run.',
  CRON_JOB_MANGAS_TO_CHECK: 'Found %d manga(s) to check for updates.',
  CRON_JOB_CHECKING_MANGA: 'Checking for updates on: %s (%s)',
  CRON_JOB_NEW_CHAPTER_FOUND: 'New chapter found for %s: %s',
  CRON_JOB_NOTIFICATION_SENT: 'Notification sent to %s for %s',
  CRON_JOB_NO_CHAPTER_DETECTED: 'Could not detect a chapter for %s.',
  CRON_JOB_NO_UPDATE: 'No new update for %s.',
  CRON_JOB_MANGA_CHECK_FAILED: 'Failed to check manga %s (%s): %s',
  CRON_JOB_COMPLETE: 'Finished checking for manga updates.',
  CRON_JOB_NOTIFICATION_QUEUED: 'Queued notification for %s for manga %s',
  DIGEST_JOB_START: 'Running digest job for frequency: %s',
  DIGEST_JOB_NO_NOTIFICATIONS: 'No pending notifications for %s digest.',
  DIGEST_JOB_SUCCESS: 'Sent %s digest to %s with %d updates.',
  DIGEST_JOB_FAILURE: 'Failed to send %s digest to %s:',
  DIGEST_JOBS_STARTING: 'Starting digest sender cron jobs.',
  CRON_JOB_INVALID_URL: 'Invalid URL for manga %s: %s',
  CRON_JOB_PROCESSING_DOMAIN: 'Processing %d manga(s) for domain: %s with rate limiting.',
  MANGA_CHECKER_JOB_STARTING: 'Starting manga update checker cron job.',
};

export const LOGGER_CONFIG = {
  TIMESTAMP_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  LEVEL_INFO: 'info',
  LEVEL_ERROR: 'error',
  LEVEL_DEBUG: 'debug',
  PROD_LOG_ERROR: 'logs/error.log',
  PROD_LOG_COMBINED: 'logs/combined.log',
  DEV_LOG_ERROR: 'logs/dev-error.log',
  DEV_LOG_COMBINED: 'logs/dev-combined.log',
  PROD_ENV: 'production',
  BEARER_PREFIX: 'Bearer ',
  BOOLEAN_TRUE_STRING: 'true',
  NOTIFICATION_FREQUENCIES: ['instant', 'daily', 'weekly'],
  EMAIL_SUBJECT_KEY: 'digest.%s.subject',
  EMAIL_BODY_KEY: 'digest.%s.body',
};

export const AUTH_CONFIG = {
  BEARER_PREFIX: 'Bearer ',
};

export const SWAGGER_CONFIG = {
  OPENAPI_VERSION: '3.0.0',
  API_TITLE: 'Manhwa Notifier API',
  API_VERSION: '1.0.0',
  API_DESCRIPTION: 'API documentation for the Manhwa Notifier backend',
  API_BASE_PATH: '/api',
  SECURITY_SCHEME_TYPE: 'http',
  SECURITY_SCHEME: 'bearer',
  BEARER_FORMAT: 'JWT',
  APIS_PATH: './src/routes/*.js',
};

export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
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

export const SEED_MESSAGES = {
  MONGO_URI_NOT_FOUND: 'MongoDB URI not found. Please set MONGODB_URI in your .env file.',
  MONGO_CONNECTED: 'MongoDB connected successfully.',
  MONGO_CONNECTION_ERROR: 'MongoDB connection error:',
  MONGO_DISCONNECTED: 'MongoDB disconnected.',
  ADMIN_EMAIL_PROMPT: 'Enter admin email:',
  ADMIN_PASSWORD_PROMPT: 'Enter admin password:',
  INVALID_EMAIL_FORMAT: 'Invalid email format.',
  PASSWORD_STRENGTH_FAIL: 'Password does not meet strength requirements.',
  ADMIN_CREATION_CANCELLED: 'Admin creation cancelled.',
  ADMIN_ALREADY_EXISTS: 'An admin with this email already exists.',
  ADMIN_CREATED_SUCCESS: 'Admin user created successfully!',
  ADMIN_CREATION_ERROR: 'Error creating admin user:',
  SCRAPING_CONFIG_SEEDED: 'Seeded scraping config for: %s',
  SCRAPING_CONFIG_EXISTS: 'Scraping config for %s already exists. Skipping.',
  SCRAPING_SEED_COMPLETE: 'Scraping config seeding complete.',
  SCRAPING_SEED_ERROR: 'Error seeding scraping configs:',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
};

export const SYSTEM_CONSTANTS = {
  SYSTEM_USER: 'SYSTEM',
  REGEX_I: 'i',
  BOOLEAN_TRUE_STRING: 'true',
  SCRAPER_STRATEGY_STATIC: 'static',
  SCRAPER_STRATEGY_DYNAMIC: 'dynamic',
  NOTIFICATION_FREQUENCIES: ['instant', 'daily', 'weekly'],
};

export const SCRAPER_CONFIG = {
  USER_AGENT:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  RATE_LIMIT_INTERVAL_MS: 5000,
  RATE_LIMIT_REQUESTS: 1,
};

export const PROXY_CONFIG = {
  getProxy: () => {
    if (!PROXY_LIST) {
      return null;
    }
    const proxies = PROXY_LIST.split(',').filter(p => p.trim() !== '');
    if (proxies.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * proxies.length);
    return proxies[randomIndex];
  },
};

export const DIGEST_CONFIG = {
  DAILY_SCHEDULE: '0 9 * * *', // 9 AM UTC
  WEEKLY_SCHEDULE: '0 9 * * 0', // 9 AM UTC on Sunday
  STATUS_SENT: 'sent',
  FREQUENCY_DAILY: 'daily',
  FREQUENCY_WEEKLY: 'weekly',
  EMAIL_SUBJECT_KEY: 'digest.%s.subject',
  EMAIL_BODY_KEY: 'digest.%s.body',
};

export const MANGA_CHECKER_CONFIG = {
  SCHEDULE: '0 * * * *', // Every hour
  INSTANT_EMAIL_SUBJECT_KEY: 'newChapter',
  INSTANT_EMAIL_BODY_KEY: 'newChapter.body',
};

export {
  PORT,
  MONGODB_URI,
  NODE_ENV,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  SERVER_URL,
  ADMIN_CREATION_SECRET,
};
