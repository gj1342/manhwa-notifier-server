import bcrypt from 'bcryptjs';
import userRepository from '../repository/userRepository.js';
import { ERROR_MESSAGES, RESPONSE_MESSAGES, STATUS_CODES } from '../config/common.js';
import userService from '../services/userService.js';

const register = async (req, res, next) => {
  try {
    const origin = req.headers.origin || req.get('origin') || '';
    const user = await userService.createUser(req.body, origin);
    res.status(STATUS_CODES.CREATED).json({ message: RESPONSE_MESSAGES.REGISTER_SUCCESS });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await userService.loginUser(req.body);
    res.status(STATUS_CODES.SUCCESS).json(result);
  } catch (err) {
    next(err);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    await userService.verifyEmail(req.query.token);
    res.status(STATUS_CODES.SUCCESS).json({ message: RESPONSE_MESSAGES.EMAIL_VERIFIED });
  } catch (err) {
    next(err);
  }
};

const requestPasswordReset = async (req, res, next) => {
  try {
    await userService.requestPasswordReset(req.body.email);
    res.status(STATUS_CODES.SUCCESS).json({ message: RESPONSE_MESSAGES.PASSWORD_RESET_SENT });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    await userService.resetPassword(req.body.token, req.body.newPassword);
    res.status(STATUS_CODES.SUCCESS).json({ message: RESPONSE_MESSAGES.PASSWORD_RESET_SUCCESS });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    await userService.logoutUser(req);
    res.status(STATUS_CODES.SUCCESS).json({ message: RESPONSE_MESSAGES.LOGOUT_SUCCESS });
  } catch (err) {
    next(err);
  }
};

const createAdmin = async (req, res, next) => {
  try {
    const adminUser = await userService.createAdmin(req.body);
    res.status(STATUS_CODES.CREATED).json(adminUser);
  } catch (err) {
    next(err);
  }
};

export {
  createAdmin,
  register,
  login,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  logout
}; 