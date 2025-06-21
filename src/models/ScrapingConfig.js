import { Schema, model } from 'mongoose';

const scrapingConfigSchema = new Schema(
  {
    domain: { type: String, required: true, unique: true },
    chapterSelector: { type: String, required: true },
    scrapingStrategy: {
      type: String,
      enum: ['static', 'dynamic'],
      default: 'static',
    },
    lastVerified: Date,
  },
  { timestamps: true }
);

export default model('ScrapingConfig', scrapingConfigSchema); 