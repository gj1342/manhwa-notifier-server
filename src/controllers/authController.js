import bcrypt from 'bcryptjs';
import userRepository from '../repository/userRepository.js';
import { ERROR_MESSAGES, RESPONSE_MESSAGES, STATUS_CODES } from '../config/common.js';
import userService from '../services/userService.js';

export const register = async (req, res, next) => {
  try {
    const origin = req.headers.origin || req.get('origin') || '';
    const user = await userService.createUser(req.body, origin);
    res.status(201).json({ message: RESPONSE_MESSAGES.REGISTER_SUCCESS });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await userService.loginUser(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    await userService.verifyEmail(req.query.token);
    res.status(200).json({ message: RESPONSE_MESSAGES.EMAIL_VERIFIED });
  } catch (err) {
    next(err);
  }
};

export const requestPasswordReset = async (req, res, next) => {
  try {
    await userService.requestPasswordReset(req.body.email);
    res.status(200).json({ message: RESPONSE_MESSAGES.PASSWORD_RESET_SENT });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    await userService.resetPassword(req.body.token, req.body.newPassword);
    res.status(200).json({ message: RESPONSE_MESSAGES.PASSWORD_RESET_SUCCESS });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    await userService.logoutUser(req);
    res.status(200).json({ message: RESPONSE_MESSAGES.LOGOUT_SUCCESS });
  } catch (err) {
    next(err);
  }
}; 