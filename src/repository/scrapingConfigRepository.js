import ScrapingConfig from '../models/ScrapingConfig.js';

const findByDomain = (domain) => ScrapingConfig.findOne({ domain });
const create = (data) => ScrapingConfig.create(data);
const updateByDomain = (domain, update) => ScrapingConfig.findOneAndUpdate({ domain }, update, { new: true });

export default {
  findByDomain,
  create,
  updateByDomain,
};
