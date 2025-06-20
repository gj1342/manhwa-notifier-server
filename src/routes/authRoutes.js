/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and account recovery endpoints
 */
import { Router } from 'express';
import { register, login, verifyEmail, requestPasswordReset, resetPassword, logout } from '../controllers/authController.js';
import { registerValidation } from '../middleware/validation.js';
import { validationResult } from 'express-validator';
import { API_ENDPOINTS } from '../config/endpoints.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered. Please check your email to verify your account.
 */
router.post(
  API_ENDPOINTS.AUTH.REGISTER,
  authRateLimiter,
  registerValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    register(req, res, next);
  }
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in
 */
router.post(API_ENDPOINTS.AUTH.LOGIN, authRateLimiter, login);

/**
 * @swagger
 * /api/auth/verify-email:
 *   get:
 *     summary: Verify user email
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
 */
router.get(API_ENDPOINTS.AUTH.VERIFY_EMAIL, verifyEmail);

/**
 * @swagger
 * /api/auth/request-password-reset:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset email sent
 */
router.post(API_ENDPOINTS.AUTH.REQUEST_PASSWORD_RESET, requestPasswordReset);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, resetPassword);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user (invalidate JWT)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized (no or invalid token)
 */
// Logout endpoint
router.post(API_ENDPOINTS.AUTH.LOGOUT, authMiddleware, logout);

export default router; 