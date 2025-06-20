/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and profile endpoints
 */
import { Router } from 'express';
import userService from '../services/userService.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { API_ENDPOINTS } from '../config/endpoints.js';
import { ForbiddenError, NotFoundError } from '../utils/errors.js';
import { ERROR_MESSAGES, RESPONSE_MESSAGES } from '../config/common.js';

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Forbidden
 */
router.get(API_ENDPOINTS.USERS.ROOT, authMiddleware, async (req, res, next) => {
  try {
    userService.requireRole(req.user, 'admin');
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID (self or admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User profile
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.get(API_ENDPOINTS.USERS.BY_ID, authMiddleware, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) throw new ForbiddenError();
    const user = await userService.getUser(req.params.id);
    if (!user) throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user (self or admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.put(API_ENDPOINTS.USERS.BY_ID, authMiddleware, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) throw new ForbiddenError();
    const updated = await userService.updateUser({ ...req.body, _id: req.params.id }, req.user);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Soft delete user (self or admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User soft deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.delete(API_ENDPOINTS.USERS.BY_ID, authMiddleware, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) throw new ForbiddenError();
    await userService.deleteUser(req.params.id, req.user);
    res.status(200).json({ message: RESPONSE_MESSAGES.USER_SOFT_DELETED });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /users/{id}/hard-delete:
 *   post:
 *     summary: Hard delete user (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User hard deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.post(API_ENDPOINTS.USERS.HARD_DELETE, authMiddleware, async (req, res, next) => {
  try {
    userService.requireRole(req.user, 'admin');
    await userService.hardDeleteUser(req.params.id, req.user);
    res.status(200).json({ message: RESPONSE_MESSAGES.USER_HARD_DELETED });
  } catch (err) {
    next(err);
  }
});

export default router; 