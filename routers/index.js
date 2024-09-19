import { Router } from 'express';
import { getListUser } from '../controllers/userController.js';
import userRoutes from './userRoutes.js';
import authRoutes from './authRouter.js';
import { adminRegister, admin } from '../middleware/authMiddleware.js';

const router = Router();

router.use('/user', userRoutes, getListUser);
router.use('/auth', authRoutes , adminRegister,admin);
export default router;
