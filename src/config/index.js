import dotenv from 'dotenv';
dotenv.config();

export const port = process.env.PORT || 5000;
export const jwtSecret = process.env.JWT_SECRET || 'secret';
export const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h'; 