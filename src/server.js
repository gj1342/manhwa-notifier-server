import './config/env.js';
import http from 'http';
import connectDB from './config/db.js';
import app from './app.js';
import logger from './config/logger.js';
import mangaUpdateChecker from './jobs/mangaUpdateChecker.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    http.createServer(app).listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      mangaUpdateChecker.start();
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 