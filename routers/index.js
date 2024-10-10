import { Router } from 'express';
import { getListUser } from '../controllers/userController.js';
import userRoutes from './userRoutes.js';
import authRoutes from './authRouter.js';
import classRoute from './classRouter.js';
import { adminRegister, admin } from '../middleware/authMiddleware.js';
import facultyRouter from './facultyRouter.js';

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
router.use('/class',classRoute, admin);
router.use('/faculty',facultyRouter ,admin);

export default router;