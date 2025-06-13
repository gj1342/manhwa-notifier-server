export const register = async (req, res, next) => {
  res.status(201).json({ message: 'User registered' });
};

export const login = async (req, res, next) => {
  res.json({ message: 'User logged in' });
}; 