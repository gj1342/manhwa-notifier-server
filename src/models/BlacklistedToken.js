import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const blacklistedTokenSchema = new Schema({
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true }
});

export default model('BlacklistedToken', blacklistedTokenSchema); 