import { SYSTEM_CONSTANTS } from '../config/common.js';

// Placeholder for validation schemas (e.g., using Joi)
export const validate = () => true;

export const isStrongPassword = (password) => {
  if (typeof password !== 'string') return false;
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
};

export const isValidNotificationSettings = (settings) => {
  if (!settings) return false;
  const { frequency, emailEnabled } = settings;
  if (frequency && !SYSTEM_CONSTANTS.NOTIFICATION_FREQUENCIES.includes(frequency)) {
    return false;
  }
  if (emailEnabled !== undefined && typeof emailEnabled !== 'boolean') {
    return false;
  }
  return true;
}; 