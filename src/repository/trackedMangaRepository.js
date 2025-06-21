import TrackedManga from '../models/TrackedManga.js';

const normalizeCriteria = (criteria) => {
  if (typeof criteria === 'string') return { _id: criteria };
  return criteria || {};
};

const getTrackedManga = (criteria) => {
  const normalizedCriteria = normalizeCriteria(criteria);
  return TrackedManga.findOne(normalizedCriteria).lean();
};

const getTrackedMangas = (filter = {}) => {
  return TrackedManga.find(filter).lean();
};

const createTrackedManga = (data) => TrackedManga.create(data);

const updateTrackedManga = (criteria, update) => {
  const normalizedCriteria = normalizeCriteria(criteria);
  return TrackedManga.findOneAndUpdate(normalizedCriteria, update, { new: true }).lean();
};

const deleteTrackedManga = (criteria) => {
  const normalizedCriteria = normalizeCriteria(criteria);
  return TrackedManga.findOneAndDelete(normalizedCriteria).lean();
};

export default {
  getTrackedManga,
  getTrackedMangas,
  createTrackedManga,
  updateTrackedManga,
  deleteTrackedManga,
};
