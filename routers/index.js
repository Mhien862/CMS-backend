import { Router } from 'express';
import { getListUser } from '../controllers/userController.js';
import { getRole } from '../controllers/userController.js';
import userRoutes from './userRoutes.js';
import authRoutes from './authRouter.js';
import { adminRegister, admin } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

router.use('/user', userRoutes, getListUser,admin);
router.use('/auth', authRoutes, adminRegister, admin);

export default router;