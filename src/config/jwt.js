const secret = process.env.JWT_SECRET || 'secret';
const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

export default {
  secret,
  expiresIn
}; 