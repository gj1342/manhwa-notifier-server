import User from '../models/User.js';

const applyQueryOptions = (query, options = {}) => {
  if (options.populate) {
    [].concat(options.populate).forEach(pop => query.populate(pop));
  }
  if (options.sort) query.sort(options.sort);
  if (options.skip) query.skip(options.skip);
  if (options.limit) query.limit(options.limit);
  query.select(options.select || '-password');
  query.lean(options.lean !== false);
  return query;
};

const normalizeCriteria = (criteria) => {
  if (typeof criteria === 'string') return { _id: criteria };
  return criteria || {};
};

const buildFilter = (baseFilter, options) => {
  let filter = { ...baseFilter };
  if (!options.includeDeleted) {
    filter.deleted = { $ne: true };
  }
  return filter;
};

const getUser = (criteria, options = {}) => {
  const normalizedCriteria = normalizeCriteria(criteria);
  const filter = buildFilter(normalizedCriteria, options);
  const query = User.findOne(filter);
  return applyQueryOptions(query, options).exec();
};

const getUsers = (filter = {}, options = {}) => {
  const finalFilter = buildFilter(filter, options);
  const query = User.find(finalFilter);
  return applyQueryOptions(query, options).exec();
};

const countUsers = (filter = {}, options = {}) => {
  const finalFilter = buildFilter(filter, options);
  return User.countDocuments(finalFilter).exec();
};

const createUser = async (data) => {
  const user = await User.create(data);
  return getUser(user._id);
};

const updateUser = (criteria, updateData, options = {}) => {
  const normalizedCriteria = normalizeCriteria(criteria);
  const filter = buildFilter(normalizedCriteria, options);
  const query = User.findOneAndUpdate(filter, updateData, { new: true });
  return applyQueryOptions(query, options).exec();
};

const deleteUser = (criteria, options = {}) => {
  const normalizedCriteria = normalizeCriteria(criteria);
  const filter = buildFilter(normalizedCriteria, options);
  return updateUser(filter, { deleted: true }, options);
};

export default {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  countUsers,
};
