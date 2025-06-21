import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },
    deleted: { type: Boolean, default: false },
    language: { type: String, default: 'en' },
    notificationSettings: {
      frequency: { type: String, default: 'instant' },
      emailEnabled: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default model('User', userSchema); 