const { Schema, model } = require('mongoose');

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

module.exports = model('ScrapingConfig', scrapingConfigSchema); 