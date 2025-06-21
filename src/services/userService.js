import bcrypt from 'bcryptjs';
import { ERROR_MESSAGES, BCRYPT_SALT_ROUNDS, ADMIN_CREATION_SECRET } from '../config/common.js';
import userRepository from '../repository/userRepository.js';
import { trimAll, generateToken } from '../utils/helpers.js';
import { isStrongPassword } from '../utils/validation.js';
import crypto from 'crypto';
import { sendLocalizedMail } from './emailService.js';
import BlacklistedToken from '../models/BlacklistedToken.js';
import jwt from 'jsonwebtoken';
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from '../utils/errors.js';

const requireRole = (user, role) => {
  if (!user || user.role !== role) throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN_INSUFFICIENT_PRIVILEGES);
};

const getUser = async (id, params = {}) => {
  if (!id) throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
  const options = {};
  if (params.populate) options.populate = params.populate;
  if (params.sort) options.sort = params.sort;
  if (params.limit) options.limit = params.limit;
  if (params.select) options.select = Array.isArray(params.select) ? params.select.join(' ') : params.select;
  if (params.lean !== undefined) options.lean = params.lean;
  return userRepository.getUser(id, options);
};

const createAdmin = async (data) => {
  const { email, password, secret } = data;

  if (secret !== ADMIN_CREATION_SECRET) {
    throw new ForbiddenError('Invalid secret for admin creation.');
  }

  const existingUser = await userRepository.getUser({ email });
  if (existingUser) {
    throw new ConflictError(ERROR_MESSAGES.USER_ALREADY_EXISTS);
  }

  if (!isStrongPassword(password)) {
    throw new BadRequestError(ERROR_MESSAGES.PASSWORD_REQUIREMENTS);
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  const adminUser = await userRepository.createUser({
    email,
    password: hashedPassword,
    role: 'admin',
    isEmailVerified: true,
  });

  return adminUser;
};

const createUser = async (data, origin) => {
  if (!data) throw new BadRequestError(ERROR_MESSAGES.SERVER_ERROR);
  const trimmedData = trimAll(data);
  const { email, password, lang = 'en', ...otherData } = trimmedData;
  const existingUser = await userRepository.getUser({ email });
  if (existingUser) throw new ConflictError(ERROR_MESSAGES.USER_ALREADY_EXISTS);
  if (!isStrongPassword(password)) throw new BadRequestError(ERROR_MESSAGES.PASSWORD_REQUIREMENTS);
  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24);
  const user = await userRepository.createUser({
    ...otherData,
    email,
    password: hashedPassword,
    isEmailVerified: false,
    emailVerificationToken: verificationToken,
    emailVerificationExpires: verificationExpires
  });
  const verifyUrl = `${origin}/verify-email?token=${verificationToken}`;
  await sendLocalizedMail({
    to: email,
    subjectKey: 'verify_subject',
    bodyKey: 'verify_body',
    data: { link: verifyUrl },
    lang
  });
  return user;
};

const verifyEmail = async (token) => {
  const user = await userRepository.getUser({ emailVerificationToken: token });
  if (!user || !user.emailVerificationExpires || user.emailVerificationExpires < new Date()) throw new BadRequestError(ERROR_MESSAGES.INVALID_VERIFICATION_TOKEN);
  await userRepository.updateUser(user._id.toString(), {
    isEmailVerified: true,
    emailVerificationToken: null,
    emailVerificationExpires: null
  });
  return true;
};

const updateUser = async (data, actingUser) => {
  const userId = data._id?.toString();
  if (!userId) throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
  const trimmedData = trimAll(data);
  const existingUser = await userRepository.getUser(userId);
  if (!existingUser) throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
  
  if (actingUser.id.toString() !== userId) {
      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN_ACTION);
  }
  if (trimmedData.role) {
      delete trimmedData.role;
  }

  delete trimmedData._id;
  if (trimmedData.password) {
    if (!isStrongPassword(trimmedData.password)) throw new BadRequestError(ERROR_MESSAGES.PASSWORD_REQUIREMENTS);
    trimmedData.password = await bcrypt.hash(trimmedData.password, BCRYPT_SALT_ROUNDS);
  }
  trimmedData.lastActive = new Date();
  return userRepository.updateUser(userId, trimmedData);
};

const deleteUser = async (id, actingUser) => {
  if (!id) throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
  const user = await userRepository.getUser(id);
  if (!user) throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);

  if (actingUser.id.toString() !== id.toString()) {
    throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN_ACTION);
  }

  return userRepository.deleteUser(id);
};

const loginUser = async ({ email, password }) => {
  const user = await userRepository.getUser({ email }, { select: '+password +role +isEmailVerified' });
  if (!user) throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
  if (!user.isEmailVerified) throw new UnauthorizedError(ERROR_MESSAGES.EMAIL_NOT_VERIFIED);
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
  const tokenUser = { id: user._id, email: user.email, role: user.role };
  const token = generateToken(tokenUser);
  return { user: tokenUser, token };
};

const logoutUser = async (req) => {
  if (!req.user) throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    const token = auth.split(' ')[1];
    const decoded = jwt.decode(token);
    const expiresAt = decoded && decoded.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 1000 * 60 * 60 * 24);
    await BlacklistedToken.create({ token, expiresAt });
  }
};

const isTokenBlacklisted = async (token) => {
  const found = await BlacklistedToken.findOne({ token });
  return !!found;
};

const cleanupBlacklistedTokens = async () => {
  await BlacklistedToken.deleteMany({ expiresAt: { $lt: new Date() } });
};

const currentUser = async (req) => {
  if (!req.user || !req.user.id) throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
  const user = await userRepository.getUser(req.user.id, { select: '-password -__v' });
  if (!user) throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
  return { user };
};

const searchUser = async (params = {}) => {
  const filter = params.query || {};
  const options = {};
  if (params.match) Object.assign(filter, params.match);
  if (params.populate) options.populate = params.populate;
  if (params.sort) options.sort = params.sort;
  if (params.skip) options.skip = params.skip;
  if (params.select) options.select = params.select;
  if (params.limit) options.limit = params.limit;
  if (params.lean !== undefined) options.lean = params.lean;
  return userRepository.searchUser(filter, options);
};

const requestPasswordReset = async (email, lang = 'en') => {
  const user = await userRepository.getUser({ email });
  if (!user) throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 1000 * 60 * 60);
  await userRepository.updateUser(user._id.toString(), { passwordResetToken: token, passwordResetExpires: expires });
  await sendLocalizedMail({
    to: email,
    subjectKey: 'reset_subject',
    bodyKey: 'reset_body',
    data: { token },
    lang
  });
  return { resetToken: token, expires };
};

const resetPassword = async (token, newPassword) => {
  const user = await userRepository.getUser({ passwordResetToken: token });
  if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) throw new BadRequestError(ERROR_MESSAGES.INVALID_RESET_TOKEN);
  if (!isStrongPassword(newPassword)) throw new BadRequestError(ERROR_MESSAGES.PASSWORD_REQUIREMENTS);
  const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
  await userRepository.updateUser(user._id.toString(), { password: hashedPassword, passwordResetToken: null, passwordResetExpires: null });
  return true;
};

const cleanUpInactiveUsers = async () => {};

export default {
  getUser,
  createAdmin,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  currentUser,
  searchUser,
  cleanUpInactiveUsers,
  requireRole,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
  isTokenBlacklisted,
  cleanupBlacklistedTokens,
}; 