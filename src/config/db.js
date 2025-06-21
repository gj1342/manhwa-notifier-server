import mongoose from 'mongoose';
import { MONGODB_URI } from './common.js';
import logger from './logger.js';

const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      logger.error('MongoDB URI not found. Please set MONGODB_URI in your .env file.');
      process.exit(1);
    }
    await mongoose.connect(MONGODB_URI);
    logger.info('MongoDB Connected...');
  } catch (err) {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

export default connectDB; 