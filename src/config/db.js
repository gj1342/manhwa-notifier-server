import mongoose from 'mongoose';
import { ERROR_MESSAGES, RESPONSE_MESSAGES } from './common.js';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error(ERROR_MESSAGES.MONGODB_URI_NOT_DEFINED);
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log(RESPONSE_MESSAGES.MONGODB_CONNECTED);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB; 