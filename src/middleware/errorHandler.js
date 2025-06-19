const errorHandler = (err, req, res, next) => {
  const status = err.status || 400;
  const message = err.error || err.message || 'An error occurred';
  res.status(status).json({ error: message });
};

export default errorHandler; 