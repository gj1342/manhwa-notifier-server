/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only endpoints for user management
 */
import { Router } from 'express';
import adminController from '../controllers/adminController.js';
import { scrapingConfigValidation } from '../middleware/validation.js';
import handleValidationErrors from '../middleware/validationHandler.js';
import { API_ENDPOINTS } from '../config/endpoints.js';

const router = Router();
const { ADMIN } = API_ENDPOINTS;

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users to return per page.
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter users by email (case-insensitive search).
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [user, admin]
 *         description: Filter users by role.
 *       - in: query
 *         name: isEmailVerified
 *         schema:
 *           type: boolean
 *         description: Filter users by email verification status.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: -createdAt
 *         description: Sort order (e.g., 'email', '-createdAt').
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get(ADMIN.USERS, adminController.listUsers);

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Get a single user by ID (admin only)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get(ADMIN.USER_BY_ID, adminController.getUserById);

/**
 * @swagger
 * /admin/users/{id}:
 *   put:
 *     summary: Update a user by ID (admin only)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: The updated user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.put(ADMIN.USER_BY_ID, adminController.updateUser);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Soft delete a user by ID (admin only)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Confirmation message.
 */
router.delete(ADMIN.USER_BY_ID, adminController.softDeleteUser);

/**
 * @swagger
 * /admin/users/{id}/hard-delete:
 *   delete:
 *     summary: Permanently delete a user by ID (admin only)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Confirmation message.
 */
router.delete(ADMIN.USER_HARD_DELETE, adminController.hardDeleteUser);

/**
 * @swagger
 * /admin/scraping-configs:
 *   post:
 *     summary: Create a new scraping configuration (admin only)
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ScrapingConfig'
 *           example:
 *             domain: "demonicscans.org"
 *             chapterSelector: "a.chplinks"
 *     responses:
 *       201:
 *         description: The created scraping configuration.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScrapingConfig'
 *       400:
 *         description: Bad request (e.g., validation error).
 *       409:
 *         description: Conflict (domain already exists).
 */
router.post(
  ADMIN.SCRAPING_CONFIGS,
  scrapingConfigValidation,
  handleValidationErrors,
  adminController.createScrapingConfig
);

export default router; 