export const API_ENDPOINTS = {
  AUTH: {
    ROOT: '/auth',
    REGISTER: '/register',
    LOGIN: '/login',
    VERIFY_EMAIL: '/verify-email',
    REQUEST_PASSWORD_RESET: '/request-password-reset',
    RESET_PASSWORD: '/reset-password',
  },
  USERS: {
    ROOT: '/',
    BY_ID: '/:id',
    HARD_DELETE: '/:id/hard-delete',
  },
  MANGA: {
    ROOT: '/manga',
    BASE: '/',
    BY_ID: '/:id',
  },
}; 