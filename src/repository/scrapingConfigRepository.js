import ScrapingConfig from '../models/ScrapingConfig.js';

const normalizeCriteria = (criteria) => {
  if (typeof criteria === 'string') return { domain: criteria };
  return criteria || {};
};

const getScrapingConfig = (criteria) => {
  const normalizedCriteria = normalizeCriteria(criteria);
  return ScrapingConfig.findOne(normalizedCriteria).lean();
};

const createScrapingConfig = (data) => ScrapingConfig.create(data);

const updateScrapingConfig = (criteria, update) => {
  const normalizedCriteria = normalizeCriteria(criteria);
  return ScrapingConfig.findOneAndUpdate(normalizedCriteria, update, { new: true }).lean();
};

export default {
  getScrapingConfig,
  createScrapingConfig,
  updateScrapingConfig,
};
