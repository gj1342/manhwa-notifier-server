import mongoose from 'mongoose';
import prompts from 'prompts';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';
import { isStrongPassword } from '../src/utils/validation.js';
import { BCRYPT_SALT_ROUNDS, MONGODB_URI } from '../src/config/common.js';

dotenv.config({ path: './.env' });

const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      console.error('MongoDB URI not found. Please set MONGODB_URI in your .env file.');
      process.exit(1);
    }
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully.');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
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
        message: 'Enter admin email:',
        validate: value => (/.+@.+\..+/.test(value) ? true : 'Invalid email format.'),
      },
      {
        type: 'password',
        name: 'password',
        message: 'Enter admin password:',
        validate: value => (isStrongPassword(value) ? true : 'Password does not meet strength requirements.'),
      },
    ]);

    const { email, password } = response;

    if (!email || !password) {
      console.log('Admin creation cancelled.');
      return;
    }

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.error('An admin with this email already exists.');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    await User.create({
      email,
      password: hashedPassword,
      role: 'admin',
      isEmailVerified: true,
    });

    console.log('Admin user created successfully!');
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

createAdmin();
