export const API_ENDPOINTS = {
  AUTH: {
    ROOT: '/auth',
    REGISTER: '/register',
    CREATE_ADMIN: '/create-admin',
    LOGIN: '/login',
    LOGOUT: '/logout',
    VERIFY_EMAIL: '/verify-email',
    REQUEST_PASSWORD_RESET: '/request-password-reset',
    RESET_PASSWORD: '/reset-password',
  },
  USERS: {
    ROOT: '/',
    BY_ID: '/:id',
    HARD_DELETE: '/:id/hard-delete',
    ME: '/me',
  },
  MANGA: {
    ROOT: '/manga',
    BASE: '/',
    BY_ID: '/:id',
  },
  ADMIN: {
    ROOT: '/admin',
    USERS: '/users',
    USER_BY_ID: '/users/:id',
    USER_HARD_DELETE: '/users/:id/hard-delete',
    SCRAPING_CONFIGS: '/scraping-configs',
  },
}; 