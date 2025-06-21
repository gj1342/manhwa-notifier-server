import mongoose from 'mongoose';
import { MONGODB_URI, LOG_MESSAGES } from './common.js';
import logger from './logger.js';

const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      logger.error(LOG_MESSAGES.DB_URI_NOT_FOUND);
      process.exit(1);
    }
    await mongoose.connect(MONGODB_URI);
    logger.info(LOG_MESSAGES.DB_CONNECTED);
  } catch (err) {
    logger.error(LOG_MESSAGES.DB_CONNECTION_ERROR, err);
    process.exit(1);
  }
};

export default connectDB; 