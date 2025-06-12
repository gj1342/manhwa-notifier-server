exports.register = async (req, res, next) => {
  res.status(201).json({ message: 'User registered' });
};

exports.login = async (req, res, next) => {
  res.json({ message: 'User logged in' });
}; 