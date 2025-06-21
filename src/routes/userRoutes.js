/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile endpoints for the authenticated user
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The user ID.
 *           example: 60d0fe4f5311236168a109ca
 *         email:
 *           type: string
 *           description: The user's email address.
 *           example: user@example.com
 *         role:
 *           type: string
 *           description: The user's role.
 *           enum: [user, admin]
 *           example: user
 *         isEmailVerified:
 *           type: boolean
 *           description: Whether the user's email is verified.
 *           example: true
 *         notificationSettings:
 *           type: object
 *           properties:
 *             frequency:
 *               type: string
 *               example: instant
 *             emailEnabled:
 *               type: boolean
 *               example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     UserUpdate:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *           format: password
 *         notificationSettings:
 *           type: object
 *           properties:
 *             frequency:
 *               type: string
 *             emailEnabled:
 *               type: boolean
 */
import { Router } from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get the authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get('/me', authMiddleware, userController.getMe);

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update the authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: User updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.put('/me', authMiddleware, userController.updateMe);

/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: Soft delete the authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User soft deleted
 *       404:
 *         description: User not found
 */
router.delete('/me', authMiddleware, userController.deleteMe);

export default router; 