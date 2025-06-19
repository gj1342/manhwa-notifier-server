import BlacklistedToken from '../models/BlacklistedToken.js';
export default async (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    const token = auth.split(' ')[1];
    const found = await BlacklistedToken.findOne({ token });
    if (found) return res.status(401).json({ error: 'Session revoked. Please log in again.' });
  }
  next();
}; 