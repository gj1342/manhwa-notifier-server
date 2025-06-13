import { Schema, model } from 'mongoose';

const scrapingConfigSchema = new Schema(
  {
    domain: { type: String, required: true, unique: true },
    chapterSelector: String,
    chapterTextProcessor: String,
    chapterUrlProcessor: String,
    lastVerified: Date,
  },
  { timestamps: true }
);

export default model('ScrapingConfig', scrapingConfigSchema); 