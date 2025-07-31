import 'dotenv/config';
import connectDB from '../src/config/db.js';
import scrapingConfigRepository from '../src/repository/scrapingConfigRepository.js';
import logger from '../src/config/logger.js';
import mongoose from 'mongoose';
import { SEED_MESSAGES, LOG_MESSAGES } from '../src/config/common.js';

const configs = [
  {
    domain: 'demonicscans.org',
    chapterSelector: 'a.chplinks',
    scrapingStrategy: 'dynamic',
  },
];

const seedConfigs = async () => {
  try {
    await connectDB();
    logger.info(LOG_MESSAGES.DB_CONNECTED);

    for (const config of configs) {
      const existing = await scrapingConfigRepository.getScrapingConfig({ domain: config.domain });
      if (!existing) {
        await scrapingConfigRepository.createScrapingConfig(config);
        logger.info(SEED_MESSAGES.SCRAPING_CONFIG_SEEDED, config.domain);
      } else {
        logger.warn(SEED_MESSAGES.SCRAPING_CONFIG_EXISTS, config.domain);
      }
    }

    logger.info(SEED_MESSAGES.SCRAPING_SEED_COMPLETE);
  } catch (error) {
    logger.error(SEED_MESSAGES.SCRAPING_SEED_ERROR, error);
  } finally {
    await mongoose.disconnect();
    logger.info(LOG_MESSAGES.DB_DISCONNECTED);
  }
};

seedConfigs(); 