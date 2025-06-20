import TrackedManga from '../models/TrackedManga.js';

const findByUserId = (userId) => TrackedManga.find({ userId });
const create = (data) => TrackedManga.create(data);
const findById = (id) => TrackedManga.findById(id);
const updateById = (id, update) => TrackedManga.findByIdAndUpdate(id, update, { new: true });
const deleteById = (id) => TrackedManga.findByIdAndDelete(id);

export default {
  findByUserId,
  create,
  findById,
  updateById,
  deleteById,
};
