import dotenv from 'dotenv';
dotenv.config();

export const {
  PORT,
  MONGODB_URI,
  NODE_ENV,
  JWT_SECRET,
  SERVER_URL,
  ADMIN_CREATION_SECRET,
  JWT_EXPIRES_IN,
  PROXY_LIST,
  CORS_ORIGIN,
} = process.env;
