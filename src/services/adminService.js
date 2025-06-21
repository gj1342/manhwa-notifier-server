import userRepository from '../repository/userRepository.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import { ERROR_MESSAGES, BCRYPT_SALT_ROUNDS } from '../config/common.js';
import bcrypt from 'bcryptjs';
import { isStrongPassword } from '../utils/validation.js';
import logger from '../config/logger.js';

const buildFilterFromQuery = (query) => {
  const filter = {};
  if (query.email) {
    filter.email = { $regex: query.email, $options: 'i' };
  }
  if (query.role) {
    filter.role = query.role;
  }
  if (query.isEmailVerified) {
    filter.isEmailVerified = query.isEmailVerified === 'true';
  }
  return filter;
};

const getAllUsers = async (query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filter = buildFilterFromQuery(query);

  const users = await userRepository.getUsers(filter, { skip, limit, sort: query.sort });
  const totalUsers = await userRepository.countUsers(filter);

  return {
    users,
    totalPages: Math.ceil(totalUsers / limit),
    currentPage: page,
    totalUsers,
  };
};

const getUserById = async (id, params = {}) => {
  const user = await userRepository.getUser(id, params);
  if (!user) throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
  return user;
};

const updateUser = async (userId, updateData) => {
  const userToUpdate = await userRepository.getUser(userId, { includeDeleted: true });
  if (!userToUpdate) throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);

  if (updateData.password) {
    if (!isStrongPassword(updateData.password)) {
      throw new BadRequestError(ERROR_MESSAGES.PASSWORD_REQUIREMENTS);
    }
    updateData.password = await bcrypt.hash(updateData.password, BCRYPT_SALT_ROUNDS);
  }

  const updatedUser = await userRepository.updateUser(userId, updateData);
  logger.info(`Admin updated user ${userId}`, { adminId: 'SYSTEM', targetUserId: userId, changes: Object.keys(updateData) });
  return updatedUser;
};

const softDeleteUser = async (userId) => {
  const userToDelete = await userRepository.getUser(userId);
  if (!userToDelete) throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
  const result = await userRepository.softDeleteUser(userId);
  logger.warn(`Admin soft-deleted user ${userId}`, { adminId: 'SYSTEM', targetUserId: userId });
  return result;
};

const hardDeleteUser = async (userId) => {
  const userToDelete = await userRepository.getUser(userId, { includeDeleted: true });
  if (!userToDelete) throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
  const result = await userRepository.hardDeleteUser(userId);
  logger.error(`Admin hard-deleted user ${userId}`, { adminId: 'SYSTEM', targetUserId: userId });
  return result;
};

export default {
  getAllUsers,
  getUserById,
  updateUser,
  softDeleteUser,
  hardDeleteUser,
}; 