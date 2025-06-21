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
 *           description: "A new email address. If provided, email verification will be required."
 *           example: "new.user@example.com"
 *         password:
 *           type: string
 *           format: password
 *           description: "A new, strong password. Must meet complexity requirements."
 *           example: "NewStrongPassword123!"
 *         language:
 *           type: string
 *           description: "The user's preferred language for emails."
 *           enum: [en, es]
 *           example: "en"
 *         notificationSettings:
 *           type: object
 *           properties:
 *             frequency:
 *               type: string
 *               enum: [instant, daily, weekly]
 *               description: "The frequency of update notifications."
 *               example: "daily"
 *             emailEnabled:
 *               type: boolean
 *               description: "A global toggle to enable or disable all email notifications."
 *               example: true
 */
import { Router } from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { API_ENDPOINTS } from '../config/endpoints.js';

const router = Router();
const { USERS } = API_ENDPOINTS;

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
router.get(USERS.ME, authMiddleware, userController.getMe);

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update the authenticated user's profile
 *     description: "Update the user's email, password, language, or notification settings. Any field provided will be updated."
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *           examples:
 *             fullUpdate:
 *               summary: Update all settings
 *               value:
 *                 email: "new.email@example.com"
 *                 password: "NewPassword123!"
 *                 language: "en"
 *                 notificationSettings:
 *                   frequency: "daily"
 *                   emailEnabled: true
 *             partialUpdate:
 *               summary: Update only notification frequency
 *               value:
 *                 notificationSettings:
 *                   frequency: "weekly"
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
router.put(USERS.ME, authMiddleware, userController.updateMe);

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
router.delete(USERS.ME, authMiddleware, userController.deleteMe);

export default router; 