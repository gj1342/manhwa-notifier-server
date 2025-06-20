import User from '../models/User.js';

const applyQueryOptions = (query, options = {}) => {
  if (options.populate) {
    [].concat(options.populate).forEach(pop => query.populate(pop));
  }
  if (options.sort) query.sort(options.sort);
  if (options.limit) query.limit(options.limit);
  query.select(options.select || '-password');
  query.lean(options.lean !== false);
  return query;
};

const normalizeCriteria = (criteria) => {
  if (typeof criteria === 'string') return { _id: criteria };
  if (criteria && criteria.email) return { email: criteria.email };
  return criteria || {};
};

const addNotDeleted = (filter, options) => {
  if (options && options.includeDeleted) return filter;
  return { ...filter, deleted: false };
};

const getUser = (criteria, options = {}) => {
  let filter = normalizeCriteria(criteria);
  filter = addNotDeleted(filter, options);
  const query = User.findOne(filter);
  return applyQueryOptions(query, options).exec();
};

const getUsers = (filter = {}, options = {}) => {
  filter = addNotDeleted(filter, options);
  const query = User.find(filter);
  return applyQueryOptions(query, options).exec();
};

const createUser = async (data) => {
  const user = await User.create(data);
  return getUser(user._id);
};

const updateUser = (criteria, updateData, options = {}) => {
  let filter = normalizeCriteria(criteria);
  filter = addNotDeleted(filter, options);
  const query = User.findOneAndUpdate(filter, updateData, { new: true });
  return applyQueryOptions(query, options).exec();
};

const deleteUser = (criteria, options = {}) => {
  let filter = normalizeCriteria(criteria);
  filter = addNotDeleted(filter, options);
  return updateUser(filter, { deleted: true }, options);
};

const searchUser = (filter = {}, options = {}) => getUsers(filter, options);

export default {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  searchUser,
};
