import { Router } from 'express';
import userRoutes from './userRoutes.js';
import authRoutes from './authRouter.js';
import { adminRegister, admin } from '../middleware/authMiddleware.js';

const router = Router();

router.use('/user', userRoutes);
router.use('/auth', authRoutes , adminRegister,admin);
export default router;
