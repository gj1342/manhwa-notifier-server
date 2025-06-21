import userService from '../services/userService.js';
import { NotFoundError } from '../utils/errors.js';
import { ERROR_MESSAGES, RESPONSE_MESSAGES } from '../config/common.js';

const getMe = async (req, res, next) => {
  try {
    const user = await userService.getUser(req.user.id);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const updated = await userService.updateUser({ ...req.body, _id: req.user.id }, req.user);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

const deleteMe = async (req, res, next) => {
  try {
    await userService.deleteUser(req.user.id, req.user);
    res.status(200).json({ message: RESPONSE_MESSAGES.USER_SOFT_DELETED });
  } catch (err) {
    next(err);
  }
};

export default {
  getMe,
  updateMe,
  deleteMe,
}; 