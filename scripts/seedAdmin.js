import mongoose from 'mongoose';
import prompts from 'prompts';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';
import { isStrongPassword } from '../src/utils/validation.js';
import {
  BCRYPT_SALT_ROUNDS,
  MONGODB_URI,
  SEED_MESSAGES,
  LOG_MESSAGES,
} from '../src/config/common.js';

dotenv.config({ path: './.env' });

const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      console.error(LOG_MESSAGES.DB_URI_NOT_FOUND);
      process.exit(1);
    }
    await mongoose.connect(MONGODB_URI);
    console.log(LOG_MESSAGES.DB_CONNECTED);
  } catch (err) {
    console.error(LOG_MESSAGES.DB_CONNECTION_ERROR, err.message);
    process.exit(1);
  }
};

const createAdmin = async () => {
  await connectDB();

  try {
    const response = await prompts([
      {
        type: 'text',
        name: 'email',
        message: SEED_MESSAGES.ADMIN_EMAIL_PROMPT,
        validate: (value) => (/.+@.+\..+/.test(value) ? true : SEED_MESSAGES.INVALID_EMAIL_FORMAT),
      },
      {
        type: 'password',
        name: 'password',
        message: SEED_MESSAGES.ADMIN_PASSWORD_PROMPT,
        validate: (value) => (isStrongPassword(value) ? true : SEED_MESSAGES.PASSWORD_STRENGTH_FAIL),
      },
    ]);

    const { email, password } = response;

    if (!email || !password) {
      console.log(SEED_MESSAGES.ADMIN_CREATION_CANCELLED);
      return;
    }

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.error(SEED_MESSAGES.ADMIN_ALREADY_EXISTS);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    await User.create({
      email,
      password: hashedPassword,
      role: 'admin',
      isEmailVerified: true,
    });

    console.log(SEED_MESSAGES.ADMIN_CREATED_SUCCESS);
  } catch (error) {
    console.error(SEED_MESSAGES.ADMIN_CREATION_ERROR, error.message);
  } finally {
    await mongoose.disconnect();
    console.log(LOG_MESSAGES.DB_DISCONNECTED);
  }
};

createAdmin();
