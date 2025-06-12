const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    notificationSettings: {
      frequency: { type: String, default: 'instant' },
      emailEnabled: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

module.exports = model('User', userSchema); 