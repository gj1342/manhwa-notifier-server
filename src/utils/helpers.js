import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/common.js';

export const absoluteUrl = (relativeUrl, baseUrl) => new URL(relativeUrl, baseUrl).href;

export const comparePasswords = (plain, hash) => bcrypt.compare(plain, hash);

export const trimAll = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const trimmed = {};
  for (const key in obj) {
    if (typeof obj[key] === 'string') trimmed[key] = obj[key].trim();
    else trimmed[key] = obj[key];
  }
  return trimmed;
};

export const generateToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

export const renderTemplate = (template, data) => {
  return template.replace(/{{(\w+)}}/g, (_, key) => data[key] || '');
}; 