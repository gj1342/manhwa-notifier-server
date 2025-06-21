import adminService from '../services/adminService.js';
import { NotFoundError } from '../utils/errors.js';
import { ERROR_MESSAGES, RESPONSE_MESSAGES } from '../config/common.js';

const createScrapingConfig = async (req, res, next) => {
  try {
    const config = await adminService.createScrapingConfig(req.body);
    res.status(201).json(config);
  } catch (err) {
    next(err);
  }
};

const listUsers = async (req, res, next) => {
  try {
    const result = await adminService.getAllUsers(req.query);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await adminService.getUserById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await adminService.updateUser(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

const softDeleteUser = async (req, res, next) => {
  try {
    await adminService.softDeleteUser(req.params.id);
    res.status(200).json({ message: RESPONSE_MESSAGES.USER_SOFT_DELETED });
  } catch (err) {
    next(err);
  }
};

const hardDeleteUser = async (req, res, next) => {
  try {
    await adminService.hardDeleteUser(req.params.id);
    res.status(200).json({ message: RESPONSE_MESSAGES.USER_HARD_DELETED });
  } catch (err) {
    next(err);
  }
};

export default {
  createScrapingConfig,
  listUsers,
  getUserById,
  updateUser,
  softDeleteUser,
  hardDeleteUser,
}; 