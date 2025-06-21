import { Router } from 'express';
import auth from '../middleware/authMiddleware.js';
import {
  createManga,
  getMangas,
  getManga,
  updateManga,
  deleteManga,
} from '../controllers/mangaController.js';
import { trackedMangaValidation } from '../middleware/validation.js';
import handleValidationErrors from '../middleware/validationHandler.js';
import { API_ENDPOINTS } from '../config/endpoints.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Manga
 *   description: Endpoints for managing tracked manga
 */
router.use(auth);

/**
 * @swagger
 * /manga:
 *   get:
 *     summary: Get all tracked manga for the authenticated user
 *     tags: [Manga]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of tracked manga.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TrackedManga'
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Add a new manga to track
 *     tags: [Manga]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: The URL of the manga page to track.
 *               mangaTitle:
 *                 type: string
 *                 description: A custom title for the manga.
 *             required:
 *               - url
 *               - mangaTitle
 *     responses:
 *       201:
 *         description: Manga created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrackedManga'
 *       400:
 *         description: Bad request (e.g., invalid URL, unsupported website).
 *       401:
 *         description: Unauthorized
 */
router
  .route(API_ENDPOINTS.MANGA.BASE)
  .post(trackedMangaValidation, handleValidationErrors, createManga)
  .get(getMangas);

/**
 * @swagger
 * /manga/{id}:
 *   get:
 *     summary: Get a specific tracked manga by ID
 *     tags: [Manga]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the tracked manga.
 *     responses:
 *       200:
 *         description: The requested tracked manga.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrackedManga'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Manga not found.
 *   put:
 *     summary: Update a tracked manga
 *     tags: [Manga]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the tracked manga.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notificationEnabled:
 *                 type: boolean
 *                 description: Enable or disable notifications for this manga.
 *     responses:
 *       200:
 *         description: Manga updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrackedManga'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Manga not found.
 *   delete:
 *     summary: Delete a tracked manga
 *     tags: [Manga]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the tracked manga.
 *     responses:
 *       204:
 *         description: Manga deleted successfully.
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Manga not found.
 */
router.route(API_ENDPOINTS.MANGA.BY_ID).get(getManga).put(updateManga).delete(deleteManga);

export default router; 